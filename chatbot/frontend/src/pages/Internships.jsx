import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink, Search } from 'lucide-react';

const mockInternships = [
  {
    id: 1,
    role: "Software Engineering Intern",
    company: "TechNova Solutions",
    location: "Remote",
    stipend: "$4,000 / month",
    tags: ["React", "Node.js", "Python"],
    type: "Summer 2026",
    link: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineering%20Intern"
  },
  {
    id: 2,
    role: "Data Science Intern",
    company: "Nexus Analytics",
    location: "San Francisco, CA",
    stipend: "$5,500 / month",
    tags: ["Python", "TensorFlow", "SQL"],
    type: "Fall 2026",
    link: "https://www.linkedin.com/jobs/search/?keywords=Data%20Science%20Intern"
  },
  {
    id: 3,
    role: "UI/UX Design Intern",
    company: "Creative Pulse",
    location: "New York, NY (Hybrid)",
    stipend: "$3,000 / month",
    tags: ["Figma", "Prototyping", "User Research"],
    type: "Summer 2026",
    link: "https://www.linkedin.com/jobs/search/?keywords=UI%20UX%20Design%20Intern"
  },
  {
    id: 4,
    role: "Cybersecurity Analyst Intern",
    company: "SecureGrid",
    location: "Remote",
    stipend: "$4,500 / month",
    tags: ["Network Security", "Ethical Hacking", "Linux"],
    type: "Immediate",
    link: "https://www.linkedin.com/jobs/search/?keywords=Cybersecurity%20Intern"
  }
];

export default function Internships() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInternships = mockInternships.filter(internship => 
    internship.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
    internship.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Latest Internships
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Discover top-tier internship opportunities tailored for your career growth.
        </p>
      </header>

      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search by role or company..." 
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
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-glow)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm) {
              window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}+internship`, '_blank');
            }
          }}
        />
        {searchTerm && (
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a855f7', fontSize: '0.9rem', pointerEvents: 'none' }}>
            Press Enter to search Web
          </div>
        )}
      </div>

      {filteredInternships.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No local internships found for "{searchTerm}"</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>But don't worry, there are thousands of opportunities available online!</p>
          <button 
            onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}+internship`, '_blank')}
            style={{ padding: '12px 24px', background: 'linear-gradient(45deg, #a855f7, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Search LinkedIn for "{searchTerm}" <ExternalLink size={18} />
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredInternships.map(internship => (
          <div key={internship.id} className="glass-panel" 
               onClick={() => window.open(internship.link, '_blank', 'noopener,noreferrer')}
               style={{ padding: '24px', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }} 
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.2)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>{internship.role}</h3>
                <p style={{ color: '#a855f7', fontWeight: '500' }}>{internship.company}</p>
              </div>
              <span style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#d8b4fe', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                {internship.type}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MapPin size={16} /> {internship.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <DollarSign size={16} /> {internship.stipend}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {internship.tags.map(tag => (
                <span key={tag} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#e4e4e7' }}>
                  {tag}
                </span>
              ))}
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(internship.link, '_blank', 'noopener,noreferrer');
              }}
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', background: 'linear-gradient(45deg, #a855f7, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Apply Now <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>
      
      {filteredInternships.length > 0 && searchTerm && (
        <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
          <p style={{ color: '#e4e4e7', marginBottom: '16px' }}>Looking for more specific internships?</p>
          <button 
            onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}+internship`, '_blank')}
            style={{ padding: '12px 24px', background: 'linear-gradient(45deg, #a855f7, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Search LinkedIn for "{searchTerm}" <ExternalLink size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
