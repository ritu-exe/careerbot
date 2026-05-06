import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Target, MessageSquare, Briefcase, BookOpen, FileText, Video, LogOut, User } from 'lucide-react';
import CareerSuggestions from './pages/CareerSuggestions';
import Chatbot from './pages/Chatbot';
import YouTube from './pages/YouTube';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Internships from './pages/Internships';
import Courses from './pages/Courses';
import StudyMaterials from './pages/StudyMaterials';
import { AuthProvider, useAuth } from './AuthContext';
import './index.css';

function Sidebar() {
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: "Career Suggestions", path: "/", icon: <Target size={20} /> },
    { name: "Chat with Career Bot", path: "/chat", icon: <MessageSquare size={20} /> },
    { name: "Internship Alerts", path: "/internships", icon: <Briefcase size={20} /> },
    { name: "Free Courses", path: "/courses", icon: <BookOpen size={20} /> },
    { name: "Study Materials", path: "/materials", icon: <FileText size={20} /> },
    { name: "YouTube Lectures", path: "/youtube", icon: <Video size={20} /> },
  ];

  return (
    <div className="glass-panel" style={{ width: '280px', height: 'calc(100vh - 40px)', position: 'fixed', top: '20px', left: '20px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Target color="#8b5cf6" />
        AI Career Guide
      </h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              color: isActive ? '#fff' : '#a1a1aa',
              background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontWeight: isActive ? '600' : '500'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      {user && (
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '8px', borderRadius: '50%' }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.username}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="btn-outline" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', textAlign: 'center', marginTop: '100px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)' }}>This feature is coming soon to our futuristic web app.</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {user && <Sidebar />}
      <main style={{ marginLeft: user ? '320px' : '0', padding: '20px 40px 20px 20px', width: '100%', maxWidth: '1200px', margin: user ? '0 auto 0 320px' : '0 auto' }}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/" element={<ProtectedRoute><CareerSuggestions /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/youtube" element={<ProtectedRoute><YouTube /></ProtectedRoute>} />
          <Route path="/internships" element={<ProtectedRoute><Internships /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/materials" element={<ProtectedRoute><StudyMaterials /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
