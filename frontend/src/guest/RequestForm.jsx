import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomContext } from './GuestLayout';
import { ArrowLeft, Send } from 'lucide-react';

export default function RequestForm() {
  const { room } = useContext(RoomContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: room.id, message })
      });
      if (res.ok) {
        alert('Request submitted! Our staff will attend to you shortly.');
        navigate('..');
      } else {
        alert('Failed to submit request.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
    setSubmitting(false);
  };

  const suggestions = ["Extra Towels", "Room Cleaning", "More Water Bottles", "Late Checkout Info"];

  return (
    <div className="animate-slide-up">
      <button onClick={() => navigate('..')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', fontSize: '1rem' }}>
        <ArrowLeft size={20} /> Back to Home
      </button>
      
      <h2 className="page-title">Special Request</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Send a direct message to reception.</p>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Your Request</label>
          <textarea 
            className="form-input" 
            rows="5" 
            placeholder="E.g., I need an extra pillow..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {suggestions.map(sug => (
            <button 
              key={sug} 
              type="button" 
              className="badge" 
              style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer', padding: '0.5rem 0.75rem' }}
              onClick={() => setMessage(prev => prev ? `${prev}, ${sug}` : sug)}
            >
              + {sug}
            </button>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
          <Send size={18} /> {submitting ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
}
