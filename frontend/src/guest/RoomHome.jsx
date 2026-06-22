import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomContext } from './GuestLayout';
import { Utensils, MessageSquare, Star } from 'lucide-react';

export default function RoomHome() {
  const { room } = useContext(RoomContext);
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 className="page-title">Welcome to Our Hotel</h2>
        <p style={{ color: 'var(--text-muted)' }}>How can we make your stay more comfortable?</p>
      </div>

      <div 
        className="glass-panel" 
        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}
        onClick={() => navigate('menu')}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
          <Utensils size={32} />
        </div>
        <h3 className="section-title" style={{ margin: 0 }}>Room Service</h3>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>Order delicious food and drinks directly to your room.</p>
      </div>

      <div 
        className="glass-panel" 
        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}
        onClick={() => navigate('request')}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-color)' }}>
          <MessageSquare size={32} />
        </div>
        <h3 className="section-title" style={{ margin: 0 }}>Special Request</h3>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>Need extra towels, cleaning, or a late checkout?</p>
      </div>

      <div 
        className="glass-panel" 
        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}
        onClick={() => navigate('feedback')}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger-color)' }}>
          <Star size={32} />
        </div>
        <h3 className="section-title" style={{ margin: 0 }}>Leave Feedback</h3>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>Tell us about your experience and how we can improve.</p>
      </div>
    </div>
  );
}
