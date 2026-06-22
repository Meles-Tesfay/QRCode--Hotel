import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';

export const RoomContext = React.createContext(null);

export default function GuestLayout() {
  const { qr_code } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + `/api/room/${qr_code}`)
      .then(res => {
        if (!res.ok) throw new Error('Invalid QR Code');
        return res.json();
      })
      .then(data => {
        setRoom(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [qr_code]);

  if (loading) {
    return (
      <div className="mobile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-fade-in" style={{ color: 'var(--primary-color)' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>This QR code is invalid or has expired. Please contact reception.</p>
      </div>
    );
  }

  return (
    <RoomContext.Provider value={{ room }}>
      <div className="mobile-container animate-fade-in">
        <header style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Room {room.room_number}</h1>
          <div className="badge" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--primary-color)' }}>Guest Access</div>
        </header>
        <main style={{ padding: '1rem' }}>
          <Outlet />
        </main>
      </div>
    </RoomContext.Provider>
  );
}
