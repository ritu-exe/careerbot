import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your AI Career Advisor. Ask me anything about trending tech roles, careers in music, or any other path!' }
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', { query: userMessage.content });
      setMessages(prev => [...prev, { role: 'bot', content: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "❌ " + (err.response?.data?.detail || "An error occurred.") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <MessageSquare size={36} color="var(--accent-color)" />
        Chat with Career Bot
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1.1rem' }}>
        Get personalized advice, interview tips, and industry trends directly from our AI.
      </p>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                display: 'flex', 
                gap: '12px', 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              {msg.role === 'bot' && (
                <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '50%', height: 'fit-content' }}>
                  <Bot size={20} color="#c4b5fd" />
                </div>
              )}
              <div style={{ 
                background: msg.role === 'user' ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '16px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.role === 'bot' ? '4px' : '16px',
                border: msg.role === 'bot' ? '1px solid var(--border-glass)' : 'none',
                lineHeight: '1.6'
              }}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '8px', borderRadius: '50%', height: 'fit-content' }}>
                  <User size={20} color="#93c5fd" />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
               <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '50%', height: 'fit-content' }}>
                  <Bot size={20} color="#c4b5fd" />
                </div>
                <div style={{ padding: '16px', color: 'var(--text-muted)' }}>Thinking...</div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Type your message here..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
