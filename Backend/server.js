const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const { initializeDb } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(session({
    store: new SQLiteStore(),
    secret: 'plis_gi_meg_en_bra_karakter',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/images', express.static(path.join(__dirname, '..', 'Frontend', 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

initializeDb();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
