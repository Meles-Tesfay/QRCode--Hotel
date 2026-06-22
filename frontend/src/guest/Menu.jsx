import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomContext } from './GuestLayout';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star } from 'lucide-react';

export default function Menu() {
  const { room } = useContext(RoomContext);
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      });
  }, []);

  const updateCart = (item, delta) => {
    setCart(prev => {
      const current = prev[item.id]?.quantity || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: { item, quantity: next } };
    });
  };

  const cartTotal = Object.values(cart).reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0);
  const cartItemsCount = Object.values(cart).reduce((sum, { quantity }) => sum + quantity, 0);

  const placeOrder = async () => {
    if (cartItemsCount === 0) return;
    setOrdering(true);
    
    const items = Object.values(cart).map(c => ({ menu_id: c.item.id, quantity: c.quantity }));
    
    try {
      const res = await fetch((import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: room.id, items })
      });
      if (res.ok) {
        alert('Order placed successfully!');
        setCart({});
        navigate('..');
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
    setOrdering(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading menu...</div>;

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '80px' }}>
      <button onClick={() => navigate('..')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', fontSize: '1rem' }}>
        <ArrowLeft size={20} /> Back to Home
      </button>
      
      <h2 className="page-title">Popular Dishes</h2>
      
      <div className="grid-menu">
        {menuItems.map(item => (
          <div key={item.id} className="grid-item-card">
            {item.image_url && <img src={item.image_url} alt={item.name} className="grid-item-img" />}
            <div className="grid-item-details">
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.2' }}>{item.name}</h4>
                <div style={{ color: 'var(--primary-color)', fontWeight: 700, marginTop: '0.25rem', fontSize: '0.85rem' }}>${item.price.toFixed(2)}</div>
                
                {/* Fake Rating based on screenshot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '0.25rem' }}>
                  <Star size={12} fill="#facc15" color="#facc15" />
                  <Star size={12} fill="#facc15" color="#facc15" />
                  <Star size={12} fill="#facc15" color="#facc15" />
                  <Star size={12} fill="#facc15" color="#facc15" />
                  <Star size={12} fill="#facc15" color="#facc15" />
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--danger-color)', fontWeight: 600 }}>🔥 Hot</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {cart[item.id]?.quantity > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color-hover)', padding: '0.25rem', borderRadius: 'var(--radius-full)' }}>
                      <button 
                        onClick={() => updateCart(item, -1)}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--surface-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, boxShadow: 'var(--shadow-sm)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', minWidth: '16px', textAlign: 'center' }}>{cart[item.id].quantity}</span>
                      <button 
                        onClick={() => updateCart(item, 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, boxShadow: 'var(--shadow-sm)' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => updateCart(item, 1)}
                      style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(67, 24, 255, 0.3)' }}
                    >
                      Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart */}
      {cartItemsCount > 0 && (
        <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 2rem)', maxWidth: '448px', zIndex: 10 }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={24} color="var(--primary-color)" />
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger-color)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {cartItemsCount}
                </span>
              </div>
              <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" onClick={placeOrder} disabled={ordering}>
              {ordering ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
