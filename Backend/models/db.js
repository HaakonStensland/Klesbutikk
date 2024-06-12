const sqlite3 = require('sqlite3').verbose();

let db;

function initializeDb() {
    db = new sqlite3.Database('./ecommerce.db', (err) => {
        if (err) {
            console.error('Could not connect to database', err);
        } else {
            console.log('Connected to database');
            createTables();
        }
    });
}

function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('user', 'admin'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS cartItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER,
        quantity INTEGER CHECK(quantity > 0),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
    )`);
}

module.exports = {
    initializeDb,
    getDb: () => db
};
