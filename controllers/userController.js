const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (error, results) => {
            if (error) return res.status(500).json(error);
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) return res.status(500).json(error);
        if (!results.length) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Authorization', token).json({ token: token, name: user.name });
    });
};
