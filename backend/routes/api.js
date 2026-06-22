const express = require('express');
const router = express.Router();
const db = require('../database');

// --- GUEST ROUTES ---

// Get room details by QR code
router.get('/room/:qr_code', (req, res) => {
    const { qr_code } = req.params;
    db.get("SELECT * FROM Rooms WHERE qr_code = ?", [qr_code], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Room not found' });
        res.json(row);
    });
});

// Get all menu items
router.get('/menu', (req, res) => {
    db.all("SELECT * FROM Menu", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Submit an order
router.post('/orders', (req, res) => {
    const { room_id, items } = req.body;
    if (!room_id || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data' });
    }

    db.run("INSERT INTO Orders (room_id, status) VALUES (?, 'Pending')", [room_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        const orderId = this.lastID;

        const stmt = db.prepare("INSERT INTO OrderItems (order_id, menu_id, quantity) VALUES (?, ?, ?)");
        items.forEach(item => {
            stmt.run(orderId, item.menu_id, item.quantity);
        });
        stmt.finalize();

        res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
    });
});

// Submit a request
router.post('/requests', (req, res) => {
    const { room_id, message } = req.body;
    if (!room_id || !message) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    db.run("INSERT INTO Requests (room_id, message, status) VALUES (?, ?, 'Pending')", [room_id, message], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Request submitted successfully', request_id: this.lastID });
    });
});

// Submit feedback
router.post('/feedback', (req, res) => {
    const { room_id, rating, comment } = req.body;
    if (!room_id || !rating) {
        return res.status(400).json({ error: 'Invalid feedback data' });
    }

    db.run("INSERT INTO Feedback (room_id, rating, comment) VALUES (?, ?, ?)", [room_id, rating, comment || null], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Feedback submitted successfully', feedback_id: this.lastID });
    });
});

// --- ADMIN ROUTES ---

// Simple login endpoint
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password123') {
        res.json({ token: 'dummy-admin-token' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Get all rooms (for QR code generation)
router.get('/rooms', (req, res) => {
    db.all("SELECT * FROM Rooms ORDER BY room_number ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get all orders with details
router.get('/orders', (req, res) => {
    const query = `
        SELECT o.id, o.status, o.created_at, r.room_number,
               GROUP_CONCAT(m.name || ' (x' || oi.quantity || ')', ', ') as items
        FROM Orders o
        JOIN Rooms r ON o.room_id = r.id
        JOIN OrderItems oi ON o.id = oi.order_id
        JOIN Menu m ON oi.menu_id = m.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Update order status
router.put('/orders/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    db.run("UPDATE Orders SET status = ? WHERE id = ?", [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order updated' });
    });
});

// Get all requests
router.get('/requests', (req, res) => {
    const query = `
        SELECT req.id, req.message, req.status, req.created_at, r.room_number
        FROM Requests req
        JOIN Rooms r ON req.room_id = r.id
        ORDER BY req.created_at DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Update request status
router.put('/requests/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    db.run("UPDATE Requests SET status = ? WHERE id = ?", [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Request updated' });
    });
});

// Get all feedback
router.get('/feedback', (req, res) => {
    const query = `
        SELECT f.id, f.rating, f.comment, f.created_at, r.room_number
        FROM Feedback f
        JOIN Rooms r ON f.room_id = r.id
        ORDER BY f.created_at DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
