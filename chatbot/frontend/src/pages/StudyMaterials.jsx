import React, { useState } from 'react';
import { FileText, Download, Eye, Search, Book, Code, Terminal, ExternalLink } from 'lucide-react';

const mockMaterials = [
  {
    id: 1,
    title: "100 Days of Code Action Plan",
    type: "Roadmap",
    icon: <Code size={24} color="#3b82f6" />,
    format: "Website",
    size: "Interactive",
    downloads: "12k+",
    link: "https://www.100daysofcode.com/"
  },
  {
    id: 2,
    title: "System Design Interview Guide",
    type: "Interview Prep",
    icon: <Book size={24} color="#10b981" />,
    format: "GitHub",
    size: "Extensive",
    downloads: "8.5k+",
    link: "https://github.com/donnemartin/system-design-primer"
  },
  {
    id: 3,
    title: "React & Next.js Docs",
    type: "Documentation",
    icon: <Terminal size={24} color="#a855f7" />,
    format: "Website",
    size: "Comprehensive",
    downloads: "15k+",
    link: "https://react.dev/learn"
  },
  {
    id: 4,
    title: "Data Structures & Algorithms",
    type: "Tutorial",
    icon: <FileText size={24} color="#f59e0b" />,
    format: "Article",
    size: "10 Min Read",
    downloads: "6.2k+",
    link: "https://www.freecodecamp.org/news/learn-data-structures-and-algorithms/"
  },
  {
    id: 5,
    title: "Behavioral Interview STAR Method",
    type: "Interview Prep",
    icon: <Book size={24} color="#ec4899" />,
    format: "Article",
    size: "5 Min Read",
    downloads: "9k+",
    link: "https://www.themuse.com/advice/star-interview-method"
  },
  {
    id: 6,
    title: "Git & GitHub Workflow Mastery",
    type: "Docs",
    icon: <Terminal size={24} color="#ef4444" />,
    format: "Website",
    size: "Official",
    downloads: "20k+",
    link: "https://docs.github.com/en/get-started"
  }
];

export default function StudyMaterials() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = mockMaterials.filter(material => 
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    material.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(to right, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Study Materials
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Downloadable roadmaps, cheat sheets, and interview guides to accelerate your preparation.
        </p>
      </header>

      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search materials..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 16px 16px 48px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm) {
              window.open(`https://www.google.com/search?q=free+study+materials+for+${encodeURIComponent(searchTerm)}`, '_blank');
            }
          }}
        />
        {searchTerm && (
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b', fontSize: '0.9rem', pointerEvents: 'none' }}>
            Press Enter to search Web
          </div>
        )}
      </div>

      {filteredMaterials.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No local materials found for "{searchTerm}"</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Let's find the exact guides you need on the web.</p>
          <button 
            onClick={() => window.open(`https://www.google.com/search?q=free+study+materials+for+${encodeURIComponent(searchTerm)}`, '_blank')}
            style={{ padding: '12px 24px', background: 'linear-gradient(45deg, #f59e0b, #ef4444)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Search Google for "{searchTerm}" <ExternalLink size={18} />
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredMaterials.map(material => (
          <div key={material.id} className="glass-panel" 
               onClick={() => window.open(material.link, '_blank', 'noopener,noreferrer')}
               style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s, background 0.2s', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
               onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}>
            
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {material.icon}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {material.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '12px', color: '#e4e4e7' }}>{material.type}</span>
                <span>{material.format} • {material.size}</span>
                <span>{material.downloads} DLs</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(material.link, '_blank', 'noopener,noreferrer');
                }}
                style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                title="Preview"
              >
                <Eye size={18} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(material.link, '_blank', 'noopener,noreferrer');
                }}
                style={{ background: 'linear-gradient(45deg, #f59e0b, #ef4444)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="Go to Resource"
              >
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length > 0 && searchTerm && (
        <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <p style={{ color: '#e4e4e7', marginBottom: '16px' }}>Need more specific resources?</p>
          <button 
            onClick={() => window.open(`https://www.google.com/search?q=free+study+materials+for+${encodeURIComponent(searchTerm)}`, '_blank')}
            style={{ padding: '12px 24px', background: 'linear-gradient(45deg, #f59e0b, #ef4444)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Search Web for "{searchTerm}" <ExternalLink size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
