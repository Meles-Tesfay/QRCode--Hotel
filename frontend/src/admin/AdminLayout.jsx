import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!token && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  if (token && location.pathname === '/admin/login') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {token && (
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-color)' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--primary-color)' }}>Hotel Admin Portal</h1>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              localStorage.removeItem('adminToken');
              window.location.href = '/admin/login';
            }}
          >
            Logout
          </button>
        </header>
      )}
      <main style={{ padding: token ? '2rem' : '0' }}>
        <Outlet />
      </main>
    </div>
  );
}
