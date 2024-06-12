const express = require('express');
const bcrypt = require('bcrypt');
const { getDb } = require('../models/db');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const db = getDb();
    
    const userCheck = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });

    if (userCheck) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'user'], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = getDb();

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        res.json({ message: 'Login successful' });
    });
});

module.exports = router;
