import React, { useState } from 'react';
import { Play, Star, Clock, ExternalLink, Search, Award } from 'lucide-react';

const mockCourses = [
  {
    id: 1,
    title: "CS50: Introduction to Computer Science",
    platform: "Harvard / edX",
    duration: "12 Weeks",
    rating: 4.9,
    category: "Computer Science",
    image: "linear-gradient(135deg, #ef4444, #991b1b)",
    link: "https://pll.harvard.edu/course/cs50-introduction-computer-science"
  },
  {
    id: 2,
    title: "Full Stack Open",
    platform: "University of Helsinki",
    duration: "Self-paced",
    rating: 4.8,
    category: "Web Development",
    image: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    link: "https://fullstackopen.com/en/"
  },
  {
    id: 3,
    title: "Machine Learning Crash Course",
    platform: "Google",
    duration: "15 Hours",
    rating: 4.7,
    category: "AI & ML",
    image: "linear-gradient(135deg, #10b981, #047857)",
    link: "https://developers.google.com/machine-learning/crash-course"
  },
  {
    id: 4,
    title: "Responsive Web Design Certification",
    platform: "freeCodeCamp",
    duration: "300 Hours",
    rating: 4.8,
    category: "Web Development",
    image: "linear-gradient(135deg, #f59e0b, #b45309)",
    link: "https://www.freecodecamp.org/learn/responsive-web-design/"
  },
  {
    id: 5,
    title: "AWS Cloud Practitioner Essentials",
    platform: "AWS Training",
    duration: "6 Hours",
    rating: 4.6,
    category: "Cloud Computing",
    image: "linear-gradient(135deg, #8b5cf6, #4c1d95)",
    link: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/"
  },
  {
    id: 6,
    title: "UX Design Professional Certificate",
    platform: "Google / Coursera",
    duration: "6 Months",
    rating: 4.8,
    category: "Design",
    image: "linear-gradient(135deg, #ec4899, #be185d)",
    link: "https://grow.google/certificates/ux-design/"
  }
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Free Online Courses
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Upskill with the best free resources from top universities and tech giants.
        </p>
      </header>

      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search by course title or category..." 
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
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm) {
              window.open(`https://www.youtube.com/results?search_query=free+course+${encodeURIComponent(searchTerm)}`, '_blank');
            }
          }}
        />
        {searchTerm && (
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6', fontSize: '0.9rem', pointerEvents: 'none' }}>
            Press Enter to search Web
          </div>
        )}
      </div>

      {filteredCourses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No local courses found for "{searchTerm}"</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>But don't worry, there are thousands of courses available online!</p>
          <button 
            onClick={() => window.open(`https://www.youtube.com/results?search_query=free+course+${encodeURIComponent(searchTerm)}`, '_blank')}
            style={{ padding: '12px 24px', background: 'linear-gradient(45deg, #3b82f6, #10b981)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Search YouTube for "{searchTerm}" <ExternalLink size={18} />
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredCourses.map(course => (
          <div key={course.id} className="glass-panel" 
               onClick={() => window.open(course.link, '_blank', 'noopener,noreferrer')}
               style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }} 
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.2)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            
            <div style={{ background: course.image, height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Play size={48} color="rgba(255, 255, 255, 0.8)" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} />
              <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {course.category}
              </span>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px', lineHeight: '1.4' }}>{course.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} /> {course.platform}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '20px', fontSize: '0.9rem', color: '#e4e4e7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#9ca3af" /> {course.duration}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 'bold' }}>
                  <Star size={16} fill="#fbbf24" /> {course.rating}
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(course.link, '_blank', 'noopener,noreferrer');
                }}
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(59, 130, 246, 0.2)'; e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(59, 130, 246, 0.1)'; e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'; }}
              >
                Start Learning <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCourses.length > 0 && searchTerm && (
        <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <p style={{ color: '#e4e4e7', marginBottom: '16px' }}>Looking for more specific courses?</p>
          <button 
            onClick={() => window.open(`https://www.youtube.com/results?search_query=free+course+${encodeURIComponent(searchTerm)}`, '_blank')}
            style={{ padding: '12px 24px', background: 'linear-gradient(45deg, #3b82f6, #10b981)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Search Web for "{searchTerm}" <ExternalLink size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
