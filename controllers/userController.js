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

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

        // Gera o token JWT
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Armazena o token no banco de dados
        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user[0].id]);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
