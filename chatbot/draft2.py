import streamlit as st
from PyPDF2 import PdfReader # This is already importing PdfReader directly
import random
import requests
import json

theme_mode = st.sidebar.selectbox("Choose Theme", ["Light", "Dark"])

YOUTUBE_API_KEY = "AIzaSyAFLAS90eSoYrEHXkwn6R0NJ5iSwV7ld4A"

def extract_text_from_pdf(file):
    pdf_reader = PdfReader(file) # Changed from PyPDF2.PdfReader to PdfReader
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

# --- Placeholder recommend_roles function ---
def recommend_roles(resume_text):
    # This is a simplified placeholder.
    # In a real application, you'd use NLP to extract skills and
    # match them to career paths.
    
    # Sample keywords and associated careers/courses
    skill_to_career = {
        "python": (["Software Developer", "Data Scientist", "AI/ML Engineer"], "https://www.coursera.org/learn/python-programming"),
        "java": (["Software Developer", "Backend Developer"], "https://www.udemy.com/course/java-programming-for-beginners/"),
        "machine learning": (["AI/ML Engineer", "Data Scientist"], "https://www.coursera.org/learn/machine-learning"),
        "data analysis": (["Data Scientist", "Business Analyst"], "https://www.edx.org/course/data-analysis-in-excel"),
        "design": (["UI/UX Designer", "Graphic Designer"], "https://www.interaction-design.org/courses/ui-ux-design-patterns"),
        "marketing": (["Digital Marketer", "Social Media Manager"], "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing"),
        "content writing": (["Content Writer", "Blogger"], "https://www.udemy.com/course/content-writing-masterclass/"),
        "finance": (["Stock Trader", "Financial Analyst"], "https://www.investopedia.com/financial-education-4628267"),
        "healthcare": (["Doctor", "Nurse", "Pharmacist"], "https://www.edx.org/learn/healthcare"),
        "civil": (["Civil Engineer", "Architect"], "https://www.coursera.org/courses?query=civil%20engineering"),
        "electrical": (["Electrical Engineer"], "https://www.udemy.com/course/electrical-engineering-bootcamp/"),
        "mechanical": (["Mechanical Engineer"], "https://www.coursera.org/courses?query=mechanical%20engineering")
    }

    found_suggestions = []
    # Check for keywords (case-insensitive) in the resume text
    for skill, (roles, course) in skill_to_career.items():
        if skill in resume_text.lower():
            found_suggestions.append((skill, roles, course))
            
    # If no specific skills found, offer general suggestions
    if not found_suggestions:
        found_suggestions.append(("General Skills", ["Project Manager", "Consultant", "Entrepreneur"], "https://www.coursera.org/browse/business"))

    return found_suggestions


# ======= OpenRouter API Setup =======
API_KEY = "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"  # <--- Replace with your key
MODEL = "mistralai/mistral-7b-instruct"
YOUTUBE_API_KEY = "AIzaSyAFLAS90eSoYrEHXkwn6R0NJ5iSwV7ld4A"  # 🔁 Replace with your actual API key


# ---------- APP CONFIG ----------
st.set_page_config(page_title="AI-Powered Career Guidance", page_icon="🎯", layout="wide")
if "theme" not in st.session_state:
    st.session_state.theme = "light"

# ---------- THEME TOGGLE ----------

def set_theme(mode):
    if mode == "Dark":
        st.markdown(
            """
            <style>
            body {
                background-color: #0e1117;
                color: #fafafa;
            }
            .stApp {
                background-color: #0e1117;
            }
            .css-18ni7ap {
                background-color: #0e1117 !important;
            }
            .css-1d391kg, .css-1v3fvcr {
                color: white !important;
            }
            </style>
            """,
            unsafe_allow_html=True
        )
    else:
        st.markdown(
            """
            <style>
            body {
                background-color: #ffffff;
                color: #000000;
            }
            .stApp {
                background-color: #ffffff;
            }
            </style>
            """,
            unsafe_allow_html=True
        )

set_theme(theme_mode)


def toggle_theme():
    if st.session_state.theme == "light":
        st.session_state.theme = "dark"
    else:
        st.session_state.theme = "light"

st.markdown(
    f"<style>body {{ background-color: {'#fff' if st.session_state.theme == 'light' else '#0E1117'}; color: {'#000' if st.session_state.theme == 'light' else '#FAFAFA'} }}</style>",
    unsafe_allow_html=True,
)
st.sidebar.button("🌗 Toggle Theme", on_click=toggle_theme)

# ---------- DATA ----------
career_list = [
    "Software Developer", "AI/ML Engineer", "Data Scientist", "Cybersecurity Analyst", "UI/UX Designer", "YouTuber",
    "Dancer", "Musician", "Chef", "Yoga Instructor", "Social Media Manager", "Fitness Trainer", "Digital Marketer",
    "Fashion Designer", "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Doctor", "Nurse",
    "Lawyer", "Teacher", "Professor", "Game Developer", "Artist", "Interior Designer", "Content Writer",
    "Blogger", "Animator", "Video Editor", "Stock Trader", "Entrepreneur", "Photographer", "Event Planner",
    "Architect", "Psychologist", "Voice Actor", "Ethical Hacker", "Translator", "Environmental Scientist",
    "Marine Biologist", "Pilot", "Astronomer", "Politician", "Historian", "Actuary", "Product Manager",
    "Sales Executive", "Biotechnologist", "Pharmacist", "Veterinarian", "Zoologist", "Astronaut", "Geologist",
    "Cartoonist", "News Anchor", "Radio Jockey", "Travel Blogger", "AI Prompt Engineer", "Technical Recruiter",
    "Cinematographer", "Drone Operator", "Nutritionist", "Bartender", "Tattoo Artist", "Social Worker",
    "Counselor", "Game Streamer", "ESports Player", "Wildlife Photographer", "SEO Specialist", "Economist",
    "Business Analyst", "Startup Founder", "Statistician", "Scriptwriter", "Historian", "Gemologist",
    "Meteorologist", "Logistics Manager", "Supply Chain Analyst", "Ethnographer", "Archaeologist",
    "Forensic Scientist", "Ethical Technologist", "AI Researcher", "Quantum Programmer", "Robotics Engineer"
]

courses = [f"Free Course on {c}" for c in career_list[:100]]
youtube_links = [f"https://www.youtube.com/watch?v=video_{i}" for i in range(100)]
study_materials = [f"{c} Study Notes" for c in career_list[:100]]

# ---------- CAREER OF THE DAY ----------
career_of_day = random.choice(career_list)
st.sidebar.markdown(f"🌟 **Career of the Day:** `{career_of_day}`")

# ---------- SIDEBAR NAVIGATION ----------
st.sidebar.title("📁 Navigation")
tabs = ["Career Suggestions", " Chat with Career Bot", "Internship Alerts", "Free Courses", "Study Materials", "YouTube Lectures"]
choice = st.sidebar.radio("Use the sidebar to navigate:", tabs)

# ======= PAGE 1: CAREER SUGGESTIONS =======
if choice == "Career Suggestions":
    st.title("🎯 AI-Powered Career Guidance Assistant")
    st.markdown("Upload your resume to get **career suggestions** including traditional and non-traditional options.")
    uploaded_file = st.file_uploader("📄 Upload your Resume (PDF only)", type="pdf")

    if uploaded_file:
        resume_text = extract_text_from_pdf(uploaded_file)
        st.success("✅ Resume Uploaded and Processed")
        suggestions = recommend_roles(resume_text)

        if suggestions:
            st.markdown("### 🔍 Based on your skills, here are some suggestions:")
            for skill, roles, course in suggestions:
                st.markdown(f"**🧠 Skill Detected:** `{skill.upper()}`")
                st.markdown(f"**👨‍💼 Suggested Roles:** {', '.join(roles)}")
                st.markdown(f"[📚 Suggested Course]({course})", unsafe_allow_html=True)
                st.markdown("---")
        else:
            st.warning("⚠️ No matching skills found in resume. Try updating your resume.")

# ======= PAGE 2: CHATBOT =======
elif choice == " Chat with Career Bot":
    st.title("💬 Ask the Career Bot")
    user_query = st.text_input("Ask me anything (e.g. trending tech roles, careers in music, etc.)")

    if user_query:
        with st.spinner("Thinking..."):
            try:
                response = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {API_KEY}",
                        "Content-Type": "application/json"
                    },
                    data=json.dumps({
                        "model": MODEL,
                        "messages": [
                            {"role": "system", "content": "You are a helpful and friendly AI career advisor."},
                            {"role": "user", "content": user_query}
                        ]
                    })
                )
                data = response.json()
                if "choices" in data:
                    reply = data["choices"][0]["message"]["content"]
                    st.success("✅ Here's what I suggest:")
                    st.write(reply)
                else:
                    st.error(f"❌ API Error: {data.get('error', {}).get('message', 'Unknown error')}")
            except Exception as e:
                st.error(f"Error: {e}")




# ---------- INTERNSHIP ALERTS ----------
elif choice == "Internship Alerts":
    st.title("📢 Internship Alerts")
    st.markdown("Here are some sample internships fetched for you:")
    sample_alerts = random.sample(career_list, 10)
    for c in sample_alerts:
        st.info(f"🚀 Internship for {c} at www.internshipportal.com/{c.replace(' ', '').lower()}")

# ---------- FREE COURSES ----------
elif choice == "Free Courses":
    st.title("🎓 100+ Free Career Courses")
    st.markdown("Click on any career path below to access free course resources from top platforms like Coursera, edX, and more.")

    # Sample mapping of careers to course links
    career_course_links = {
        "Software Developer": "https://www.coursera.org/specializations/java-programming",
        "AI/ML Engineer": "https://www.coursera.org/learn/machine-learning",
        "Data Scientist": "https://www.edx.org/learn/data-science",
        "Cybersecurity Analyst": "https://www.futurelearn.com/courses/introduction-to-cybersecurity",
        "UI/UX Designer": "https://www.interaction-design.org/courses",
        "Digital Marketer": "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",
        "Doctor": "https://www.edx.org/course/essentials-of-global-health",
        "Mechanical Engineer": "https://www.coursera.org/courses?query=mechanical%20engineering",
        "Civil Engineer": "https://www.coursera.org/courses?query=civil%20engineering",
        "Psychologist": "https://www.classcentral.com/course/coursera-introduction-to-psychology-1179",
        "Entrepreneur": "https://www.edx.org/course/becoming-an-entrepreneur",
        "Content Writer": "https://www.udemy.com/course/content-writing-masterclass/",
        "Teacher": "https://www.coursera.org/specializations/teacher-training",
        "Architect": "https://www.classcentral.com/course/coursera-making-architecture-19607",
        # Add more mappings as needed...
    }

    q = st.text_input("🔍 Search course by career:")
    for career, link in career_course_links.items():
        if q.lower() in career.lower():
            st.markdown(f"🔗 [{career}]({link})", unsafe_allow_html=True)

# ---------- STUDY MATERIALS ----------
elif choice == "Study Materials":
    st.title("📘 Study Materials")
    q = st.text_input("Search materials:")
    for item in study_materials:
        if q.lower() in item.lower():
            st.info(item)

# ---------- YOUTUBE LECTURES ----------

# YouTube API Key

# ---------- YOUTUBE LECTURES ----------
elif choice == "YouTube Lectures":
    def search_youtube(query):
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
            return response.json().get("items", [])
        else:
            return []

    st.markdown("## 🎥 YouTube Lectures")
    query = st.text_input("Search YouTube lectures:")
    if query:
        results = search_youtube(query)
        if results:
            for item in results:
                title = item["snippet"]["title"]
                channel = item["snippet"]["channelTitle"]
                thumbnail = item["snippet"]["thumbnails"]["medium"]["url"]
                video_id = item["id"]["videoId"]
                video_url = f"https://www.youtube.com/watch?v={video_id}"

                col1, col2 = st.columns([1, 3])
                with col1:
                    st.image(thumbnail, width=420)
                with col2:
                    st.markdown(f"**{title}**  \n📺 {channel}")
                    st.markdown(f"[▶️ Watch Now]({video_url})", unsafe_allow_html=True)
        else:
            st.warning("No videos found.")








