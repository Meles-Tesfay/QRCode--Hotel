import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomContext } from './GuestLayout';
import { ArrowLeft, Star } from 'lucide-react';

export default function FeedbackForm() {
  const { room } = useContext(RoomContext);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: room.id, rating, comment })
      });
      if (res.ok) {
        alert('Thank you for your feedback!');
        navigate('..');
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
    setSubmitting(false);
  };

  return (
    <div className="animate-slide-up">
      <button onClick={() => navigate('..')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', fontSize: '1rem' }}>
        <ArrowLeft size={20} /> Back to Home
      </button>
      
      <h2 className="page-title">Leave Feedback</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We value your opinion to improve our service.</p>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <label className="form-label" style={{ fontSize: '1rem', textAlign: 'center' }}>How was your experience?</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', transition: 'transform 0.1s' }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
              >
                <Star 
                  size={36} 
                  fill={star <= (hover || rating) ? '#facc15' : 'transparent'} 
                  color={star <= (hover || rating) ? '#facc15' : 'var(--text-muted)'} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Additional Comments (Optional)</label>
          <textarea 
            className="form-input" 
            rows="4" 
            placeholder="Tell us what you liked or what could be better..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
