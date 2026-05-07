import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    const wakeUp = async () => {
      setWaking(true);
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/`, { timeout: 60000 });
      } catch (_) {}
      setWaking(false);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchUser();
      } else {
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setLoading(false);
      }
    };
    wakeUp();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    setToken(res.data.access_token);
    localStorage.setItem('token', res.data.access_token);
  };

  const register = async (username, email, password) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { username, email, password });
    await login(username, password);
  };

  const continueAsGuest = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/guest`);
      setToken(res.data.access_token);
      localStorage.setItem('token', res.data.access_token);
    } catch (err) {
      console.error("Failed to create guest session", err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    continueAsGuest,
    loading,
    waking
  };

  return (
    <AuthContext.Provider value={value}>
      {waking ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(139,92,246,0.2)', borderTop: '4px solid #8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>🚀 Waking up the server, please wait...</p>
          <p style={{ color: '#71717a', fontSize: '0.85rem' }}>This may take up to 60 seconds on first visit</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : !loading ? children : null}
    </AuthContext.Provider>
  );
}
