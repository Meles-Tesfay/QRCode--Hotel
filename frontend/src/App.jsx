import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Guest Components
import GuestLayout from './guest/GuestLayout';
import RoomHome from './guest/RoomHome';
import Menu from './guest/Menu';
import RequestForm from './guest/RequestForm';
import FeedbackForm from './guest/FeedbackForm';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest Routes - Mobile First */}
        <Route path="/room/:qr_code" element={<GuestLayout />}>
          <Route index element={<RoomHome />} />
          <Route path="menu" element={<Menu />} />
          <Route path="request" element={<RequestForm />} />
          <Route path="feedback" element={<FeedbackForm />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={
          <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Welcome to QR Hotel Service</h2>
            <p style={{ color: 'var(--text-muted)' }}>Please scan your room's QR code to access the service.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
