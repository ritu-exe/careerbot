import { useState } from 'react';
import axios from 'axios';
import { Video, Search, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function YouTube() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/youtube?query=${encodeURIComponent(query)}`);
      setVideos(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching YouTube videos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Video size={36} color="#ef4444" />
        YouTube Lecture Resources
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
        Search for high-quality video lectures and career guides across YouTube.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search YouTube lectures (e.g., 'Python full course', 'Data Science roadmap')..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: '#ef4444', marginBottom: '24px' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {videos.map((video, idx) => {
          const { title, channelTitle, thumbnails } = video.snippet;
          const videoId = video.id.videoId;
          return (
            <motion.div 
              key={videoId || idx} 
              className="glass-panel" 
              style={{ display: 'flex', overflow: 'hidden', padding: 0 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
            >
              <div style={{ width: '320px', height: '180px', flexShrink: 0 }}>
                <img 
                  src={thumbnails.medium.url} 
                  alt={title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4' }} dangerouslySetInnerHTML={{ __html: title }} />
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={16} /> {channelTitle}
                </p>
                <a 
                  href={`https://www.youtube.com/watch?v=${videoId}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-outline"
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <PlayCircle size={18} /> Watch Now
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {!loading && videos.length === 0 && query && !error && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No videos found for "{query}".</p>
        </div>
      )}
    </motion.div>
  );
}
