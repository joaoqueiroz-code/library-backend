const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, result.insertId]);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user[0].id]);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
