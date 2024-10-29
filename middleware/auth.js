const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // const [user] = await db.query('SELECT * FROM users WHERE id = ? AND token = ?', [decoded.id, token]);
        
        // if (user.length === 0) return res.status(401).json({ message: 'Invalid token' });

        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
