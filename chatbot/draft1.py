import streamlit as st
import fitz  # PyMuPDF
import requests
import json

# ======= OpenRouter API Setup =======
API_KEY = "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"  # <--- Replace with your key
MODEL = "deepseek/deepseek-chat-v3-0324:free"

# ======= App Layout Setup =======
st.set_page_config(page_title="AI Career Guide", layout="wide")

premium_css = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Global Fonts and Background */
html, body, [class*="css"] {
    font-family: 'Inter', sans-serif !important;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', sans-serif !important;
    font-weight: 700;
    color: #ffffff !important;
    letter-spacing: -0.02em;
}

/* Main App Background */
.stApp {
    background-color: #09090b; /* Zinc 950 */
    background-image: radial-gradient(circle at 50% 0%, rgba(56, 56, 70, 0.1) 0%, transparent 50%);
    color: #e4e4e7; /* Zinc 200 */
}

/* Sidebar Styling */
[data-testid="stSidebar"] {
    background: rgba(9, 9, 11, 0.95) !important;
    backdrop-filter: blur(12px);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
}

[data-testid="stSidebarNav"] span {
    font-size: 0.95rem;
    font-weight: 500;
    color: #a1a1aa; /* Zinc 400 */
}

[data-testid="stSidebarNav"] span:hover {
    color: #ffffff;
}

/* Buttons */
.stButton > button {
    background: rgba(255, 255, 255, 0.05) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px !important;
    font-weight: 500;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.stButton > button:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-1px);
}

/* Text Inputs and File Uploader */
.stTextInput > div > div > input, .stFileUploader {
    background: rgba(24, 24, 27, 0.5) !important; /* Zinc 900 */
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #ffffff !important;
    border-radius: 8px;
    padding: 0.5rem;
    font-size: 0.95rem;
}

.stTextInput > div > div > input:focus {
    border-color: #6366f1 !important; /* Indigo 500 */
    box-shadow: 0 0 0 1px #6366f1 !important;
}

/* Expanders, Info Boxes, and Cards */
.st-emotion-cache-1n76uvr, .st-emotion-cache-12w0qpk { 
    background: rgba(24, 24, 27, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
}

/* Alert Boxes / Info / Success - Fix for contrast */
.stAlert, .stAlert p, .stAlert div {
    color: #e4e4e7 !important; /* Force readable text */
}

.stAlert {
    background: rgba(24, 24, 27, 0.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px;
    padding: 1rem;
}

.stSuccess {
    border-left: 4px solid #22c55e !important; /* Green 500 */
}

.stWarning {
    border-left: 4px solid #eab308 !important; /* Yellow 500 */
}

.stError {
    border-left: 4px solid #ef4444 !important; /* Red 500 */
}

.stInfo {
    border-left: 4px solid #3b82f6 !important; /* Blue 500 */
}

/* Links */
a {
    color: #818cf8 !important; /* Indigo 400 */
    text-decoration: none;
    transition: color 0.2s ease;
}

a:hover {
    color: #c7d2fe !important; /* Indigo 200 */
    text-decoration: underline;
}

/* Radio buttons in sidebar */
.stRadio > div {
    gap: 8px;
}
.stRadio label {
    background: transparent;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
    cursor: pointer;
    border: 1px solid transparent;
}
.stRadio label:hover {
    background: rgba(255, 255, 255, 0.05);
}
.stRadio label[data-checked="true"] {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* Markdown strong text */
strong {
    color: #ffffff !important;
}

/* Fix specific st.info background specifically */
div[data-testid="stNotificationContentInfo"] {
    background: transparent !important;
    color: white !important;
}
div[data-testid="stNotificationContentInfo"] p {
    color: white !important;
}
</style>
"""
st.markdown(premium_css, unsafe_allow_html=True)

st.sidebar.title("📁 Navigation")
page = st.sidebar.radio("Use the sidebar to navigate:", [
    "🎯 Career Suggestions",
    "💬 Chat with Career Bot",
    "📢 Internship Alerts",
    "📚 Free Courses",
    "📖 Study Materials",
    "🎥 YouTube Lectures"
])

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

# ======= Resume Parser =======
def extract_text_from_pdf(file):
    text = ""
    with fitz.open(stream=file.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text.lower()

# ======= Role Recommendation =======
def recommend_roles(text):
    matched = []
    for skill in skills_db:
        if skill in text:
            matched.append((skill, skills_db[skill], courses_db.get(skill)))
    return matched


# ======= PAGE 1: CAREER SUGGESTIONS =======
if page == "🎯 Career Suggestions":
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
elif page == "💬 Chat with Career Bot":
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


# ======= PAGE 3: INTERNSHIP ALERTS =======
elif page == "📢 Internship Alerts":
    st.title("📢 Internship Alerts (Coming Soon)")
    st.markdown("We're working on integrating real-time internship listings from LinkedIn, Naukri, Internshala, etc.")
    st.info("🔧 You’ll be able to see internship opportunities based on your interests and skills here.")


# ======= PAGE 4: FREE COURSES =======
elif page == "📚 Free Courses":
    st.title("📚 Recommended Free Courses")
    st.markdown("Curated online courses from trusted platforms based on popular skillsets:")
    for skill, link in courses_db.items():
        st.markdown(f"✅ **{skill.title()}** → [Visit Course]({link})")


# ======= PAGE 5: STUDY MATERIALS =======
elif page == "📖 Study Materials":
    st.title("📖 Study Materials")
    st.markdown("Free PDFs, docs, and guides will appear here in future updates.")
    st.info("You can upload your own materials or link to Google Drive, GitHub, etc.")


# ======= PAGE 6: YOUTUBE LECTURES =======
elif page == "🎥 YouTube Lectures":
    YOUTUBE_API_KEY = "AIzaSyAFLAS90eSoYrEHXkwn6R0NJ5iSwV7ld4A"
    
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

    st.title("🎥 YouTube Lecture Resources")
    st.markdown("Search for video lectures and career guides.")
    
    query = st.text_input("🔍 Search YouTube lectures:")
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
                    st.image(thumbnail, width=300)
                with col2:
                    st.markdown(f"**{title}**  \n📺 {channel}")
                    st.markdown(f"[▶️ Watch Now]({video_url})", unsafe_allow_html=True)
                st.markdown("---")
        else:
            st.warning("No videos found.")
