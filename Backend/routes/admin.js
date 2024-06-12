const express = require('express');
const { db } = require('../models/db');
const router = express.Router();

router.use((req, res, next) => {
    const role = req.body.role;
    if (role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
});

router.post('/products', (req, res) => {
    const { name, description, price, image } = req.body;
    const sql = 'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, description, price, image], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ productId: this.lastID });
    });
});

router.put('/products/:id', (req, res) => {
    const { name, description, price, image } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?';
    db.run(sql, [name, description, price, image, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product updated' });
    });
});

router.delete('/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product deleted' });
    });
});

module.exports = router;
