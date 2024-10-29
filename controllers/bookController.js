const db = require('../config/db');

exports.getBooks = (req, res) => {
    const userId = req.user.id;
    db.query('SELECT * FROM books WHERE user_id = ?', [userId], (error, results) => {
        if (error) return res.status(500).json(error);
        res.status(200).json(results);
    });
};

exports.createBook = (req, res) => {
    const { title, author } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
        return res.status(400).json({ message: 'User ID not provided' });
    }
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    db.query(
        'INSERT INTO books (title, author, user_id) VALUES (?, ?, ?)',
        [title, author, userId],
        (error, results) => {
            if (error) return res.status(500).json(error);
            res.status(201).json({ message: 'Book added successfully' });
        }
    );
};

exports.updateBook = (req, res) => {
    const { title, author } = req.body;
    const bookId = req.params.id;
    const userId = req.user.id;

    db.query(
        'UPDATE books SET title = ?, author = ? WHERE id = ? AND user_id = ?',
        [title, author, bookId, userId],
        (error, results) => {
            if (error) return res.status(500).json(error);
            res.status(200).json({ message: 'Book updated successfully' });
        }
    );
};

exports.deleteBook = (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id;

    db.query(
        'DELETE FROM books WHERE id = ? AND user_id = ?',
        [bookId, userId],
        (error, results) => {
            if (error) return res.status(500).json(error);
            res.status(200).json({ message: 'Book deleted successfully' });
        }
    );
};
