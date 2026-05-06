import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
import fitz  # PyMuPDF
import requests
import json
import uvicorn
import uuid
from typing import List, Optional
from dotenv import load_dotenv

import models
from database import engine, get_db
import auth



load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======= Config =======

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# ======= Skill & Course Mappings =======
skills_db = {
    "python": ["Data Analyst", "ML Engineer", "Python Developer"],
    "html": ["Frontend Developer", "Web Designer"],
    "sql": ["Database Engineer", "BI Analyst"],
    "java": ["Android Developer", "Backend Engineer"],
    "c++": ["Game Developer", "System Programmer"],
    "photography": ["Content Creator", "Freelance Photographer"],
    "music": ["Musician", "Music Producer", "Singer"],
    "dance": ["Dancer", "Choreographer", "Performer"],
    "sports": ["Athlete", "Fitness Coach", "Sports Analyst"],
    "influencer": ["YouTuber", "Instagram Influencer", "Brand Promoter"]
}

courses_db = {
    "python": "https://www.coursera.org/specializations/python",
    "html": "https://www.freecodecamp.org/learn/responsive-web-design/",
    "sql": "https://www.kaggle.com/learn/intro-to-sql",
    "java": "https://www.codecademy.com/learn/learn-java",
    "c++": "https://www.learncpp.com/",
    "photography": "https://www.udemy.com/course/photography-masterclass-complete-guide/",
    "music": "https://www.coursera.org/specializations/music-production",
    "dance": "https://www.skillshare.com/browse/dance",
    "sports": "https://www.coursera.org/specializations/sports-management",
    "influencer": "https://www.udemy.com/course/become-an-influencer/"
}

# ======= Pydantic Models =======
class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    reply: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

# ======= Auth Endpoints =======

@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/guest", response_model=Token)
def login_guest(db: Session = Depends(get_db)):
    guest_id = str(uuid.uuid4())[:8]
    username = f"guest_{guest_id}"
    email = f"{username}@temp.com"
    password = str(uuid.uuid4())
    
    hashed_password = auth.get_password_hash(password)
    db_user = models.User(username=username, email=email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# ======= Core Endpoints =======

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    text = ""
    try:
        content = await file.read()
        with fitz.open(stream=content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        text = text.lower()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {e}")
    
    matched = []
    for skill in skills_db:
        if skill in text:
            matched.append({
                "skill": skill,
                "roles": skills_db[skill],
                "course": courses_db.get(skill)
            })
            
    return {"suggestions": matched, "message": "Resume Uploaded and Processed" if matched else "No matching skills found in resume."}

# PROTECTED ROUTE: Requires user to be logged in
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: models.User = Depends(auth.get_current_user)):
    try:
        prompt = f"""
        You are a helpful and friendly AI career advisor.

        You are talking to user: {current_user.username}

        User query:
        {request.query}
        """

        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": f"You are a helpful and friendly AI career advisor talking to {current_user.username}."
                },
                {
                    "role": "user",
                    "content": request.query
                }
            ]
        }

        response = requests.post(url, headers=headers, json=payload)

        data = response.json()

        print(data)

        if "choices" not in data:
            raise HTTPException(
                status_code=500,
                detail=f"OpenRouter API Error: {data}"
            )

        reply = data["choices"][0]["message"]["content"]

        return {
            "reply": reply
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with OpenRouter: {str(e)}"
        )
@app.get("/api/youtube")
async def get_youtube_videos(query: str):
    search_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 10,
        "key": YOUTUBE_API_KEY,
    }
    response = requests.get(search_url, params=params)
    if response.status_code == 200:
        return {"items": response.json().get("items", [])}
    else:
        raise HTTPException(status_code=response.status_code, detail="Error fetching YouTube videos")

if __name__ == "__main__":
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
