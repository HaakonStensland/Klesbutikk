const express = require('express');
const { getDb } = require('../models/db');
const router = express.Router();

router.get('/', (req, res) => {
    const db = getDb();
    const sql = 'SELECT * FROM products';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ products: rows });
    });
});

router.get('/:id', (req, res) => {
    const db = getDb();
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ product: row });
    });
});

module.exports = router;
