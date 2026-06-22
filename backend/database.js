const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'hotel.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize tables
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_number TEXT UNIQUE,
                qr_code TEXT UNIQUE
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Menu (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                price REAL,
                category TEXT,
                image_url TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_id INTEGER,
                status TEXT DEFAULT 'Pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (room_id) REFERENCES Rooms(id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS OrderItems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER,
                menu_id INTEGER,
                quantity INTEGER,
                FOREIGN KEY (order_id) REFERENCES Orders(id),
                FOREIGN KEY (menu_id) REFERENCES Menu(id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_id INTEGER,
                message TEXT,
                status TEXT DEFAULT 'Pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (room_id) REFERENCES Rooms(id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_id INTEGER,
                rating INTEGER,
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (room_id) REFERENCES Rooms(id)
            )`);
            
            console.log('Database tables verified.');
        });
    }
});

module.exports = db;
