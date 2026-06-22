import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, requestsRes, feedbackRes, roomsRes] = await Promise.all([
        fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/orders'),
        fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/requests'),
        fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/feedback'),
        fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/rooms')
      ]);
      const [ordersData, requestsData, feedbackData, roomsData] = await Promise.all([
        ordersRes.json(),
        requestsRes.json(),
        feedbackRes.json(),
        roomsRes.json()
      ]);
      setOrders(ordersData);
      setRequests(requestsData);
      setFeedback(feedbackData);
      setRooms(roomsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (id, status) => {
    await fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + `/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const updateRequestStatus = async (id, status) => {
    await fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + `/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge badge-pending';
      case 'preparing': return 'badge badge-preparing';
      case 'completed':
      case 'delivered': return 'badge badge-delivered';
      default: return 'badge';
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        {['orders', 'requests', 'feedback', 'qr codes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
        <button 
          onClick={fetchData} 
          className="btn btn-secondary" 
          style={{ marginLeft: 'auto', marginBottom: '0.5rem', alignSelf: 'center', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          Refresh Data
        </button>
      </div>

      {loading && orders.length === 0 ? <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            orders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No orders found.</p> :
            orders.map(o => (
              <div key={o.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>Room {o.room_number}</h3>
                    <span className={getStatusBadge(o.status)}>{o.status}</span>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{o.items}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {o.status === 'Pending' && <button onClick={() => updateOrderStatus(o.id, 'Preparing')} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>Mark Preparing</button>}
                  {(o.status === 'Pending' || o.status === 'Preparing') && <button onClick={() => updateOrderStatus(o.id, 'Delivered')} className="btn btn-success" style={{ fontSize: '0.875rem' }}>Mark Delivered</button>}
                </div>
              </div>
            ))
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            requests.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No requests found.</p> :
            requests.map(r => (
              <div key={r.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>Room {r.room_number}</h3>
                    <span className={getStatusBadge(r.status)}>{r.status}</span>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>"{r.message}"</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleString()}</p>
                </div>
                <div>
                  {r.status === 'Pending' && <button onClick={() => updateRequestStatus(r.id, 'Completed')} className="btn btn-success" style={{ fontSize: '0.875rem' }}>Mark Completed</button>}
                </div>
              </div>
            ))
          )}

          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            feedback.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No feedback found.</p> :
            feedback.map(f => (
              <div key={f.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>Room {f.room_number}</h3>
                  <div style={{ display: 'flex', color: '#facc15' }}>
                    {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                  </div>
                </div>
                {f.comment && <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>"{f.comment}"</p>}
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(f.created_at).toLocaleString()}</p>
              </div>
            ))
          )}

          {/* QR CODES TAB */}
          {activeTab === 'qr codes' && (
            rooms.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No rooms found.</p> :
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {rooms.map(room => {
                const roomUrl = `${window.location.origin}/room/${room.qr_code}`;
                return (
                  <div key={room.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Room {room.room_number}</h3>
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '8px' }}>
                      <QRCodeCanvas id={`qr-${room.room_number}`} value={roomUrl} size={150} level={"H"} />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{roomUrl}</p>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                      onClick={() => {
                        const canvas = document.getElementById(`qr-${room.room_number}`);
                        const url = canvas.toDataURL("image/png");
                        const link = document.createElement('a');
                        link.download = `Room_${room.room_number}_QRCode.png`;
                        link.href = url;
                        link.click();
                      }}
                    >
                      Download QR
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
