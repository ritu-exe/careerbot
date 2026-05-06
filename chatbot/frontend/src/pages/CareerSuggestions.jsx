import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Target, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareerSuggestions() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎯 AI-Powered Career Guidance</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
        Upload your resume to get career suggestions including traditional and non-traditional options.
      </p>

      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
        <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
        <h3 style={{ marginBottom: '16px' }}>Upload your Resume (PDF only)</h3>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          id="file-upload" 
        />
        <label htmlFor="file-upload" className="btn-outline" style={{ display: 'inline-block', marginBottom: '16px' }}>
          {file ? file.name : "Choose File"}
        </label>
        <br />
        <button 
          className="btn-primary" 
          onClick={handleUpload} 
          disabled={!file || loading}
          style={{ opacity: (!file || loading) ? 0.5 : 1 }}
        >
          {loading ? "Processing..." : "Analyze Resume"}
        </button>
        {error && <p style={{ color: '#ef4444', marginTop: '16px' }}>{error}</p>}
      </div>

      {results && results.suggestions && results.suggestions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target color="#3b82f6" />
            Based on your skills:
          </h2>
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {results.suggestions.map((item, idx) => (
              <motion.div 
                key={idx} 
                className="glass-panel" 
                style={{ padding: '24px' }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '8px' }}>
                    <Target size={20} color="#c4b5fd" />
                  </div>
                  <h3 style={{ textTransform: 'capitalize', color: '#c4b5fd' }}>{item.skill}</h3>
                </div>
                <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'white' }}>Suggested Roles:</strong><br/>
                  {item.roles.join(', ')}
                </p>
                {item.course && (
                  <a href={item.course} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <BookOpen size={16} /> Suggested Course
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {results && results.suggestions && results.suggestions.length === 0 && (
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #eab308' }}>
          <p style={{ color: '#fef08a' }}>⚠️ No matching skills found in resume. Try updating your resume.</p>
        </div>
      )}
    </motion.div>
  );
}
