const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'hotel.sqlite');
const db = new sqlite3.Database(dbPath);

const rooms = [
    { room_number: '101', qr_code: 'room101-secret-qr' },
    { room_number: '102', qr_code: 'room102-secret-qr' },
    { room_number: '201', qr_code: 'room201-secret-qr' },
    { room_number: '202', qr_code: 'room202-secret-qr' }
];

const menuItems = [
    { name: 'Grilled Salmon', price: 24.99, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=400' },
    { name: 'Creamy Prawn Pasta', price: 21.99, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=400' },
    { name: 'Ribeye Steak', price: 29.99, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Classic Tiramisu', price: 8.99, category: 'Dessert', image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Truffle Mushroom Risotto', price: 19.99, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=400' },
    { name: 'Margherita Pizza', price: 16.50, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400' },
    { name: 'Mango Passion Mocktail', price: 7.99, category: 'Drink', image_url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400' },
    { name: 'Chocolate Lava Cake', price: 9.99, category: 'Dessert', image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=400' },
    { name: 'Signature Burger', price: 14.50, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' }
];

db.serialize(() => {
    console.log('Initializing database tables...');
    
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

    // Clear existing data
    db.run("DELETE FROM Rooms");
    db.run("DELETE FROM Menu");
    db.run("DELETE FROM sqlite_sequence WHERE name='Rooms' OR name='Menu'");

    // Insert rooms
    const stmtRooms = db.prepare("INSERT INTO Rooms (room_number, qr_code) VALUES (?, ?)");
    rooms.forEach(room => {
        stmtRooms.run(room.room_number, room.qr_code);
    });
    stmtRooms.finalize();

    // Insert menu items
    const stmtMenu = db.prepare("INSERT INTO Menu (name, price, category, image_url) VALUES (?, ?, ?, ?)");
    menuItems.forEach(item => {
        stmtMenu.run(item.name, item.price, item.category, item.image_url);
    });
    stmtMenu.finalize();

    console.log('Database seeded with dummy data.');
});

db.close();
