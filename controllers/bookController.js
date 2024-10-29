const db = require('../config/db');

exports.getBooks = async (req, res) => {
    const userId = req.user.id;

    try {
        const [results] = await db.execute('SELECT * FROM books WHERE user_id = ?', [userId]);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.createBook = async (req, res) => {
    const { title, author } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
        return res.status(400).json({ message: 'User ID not provided' });
    }
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    try {
        console.log('Inserting book into database...');
        const [result] = await db.execute(
            'INSERT INTO books (title, author, user_id) VALUES (?, ?, ?)',
            [title, author, userId]
        );

        if (result.affectedRows > 0) {
            console.log('Book added successfully');
            return res.status(201).json({ message: 'Book added successfully' });
        } else {
            return res.status(500).json({ message: 'Book not added' });
        }
    } catch (error) {
        console.error('Error inserting book:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateBook = async (req, res) => {
    const { title, author } = req.body;
    const bookId = req.params.id;
    const userId = req.user.id;

    try {
        const [result] = await db.execute(
            'UPDATE books SET title = ?, author = ? WHERE id = ? AND user_id = ?',
            [title, author, bookId, userId]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Book updated successfully' });
        } else {
            res.status(404).json({ message: 'Book not found or not updated' });
        }
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id;

    try {
        const [result] = await db.execute(
            'DELETE FROM books WHERE id = ? AND user_id = ?',
            [bookId, userId]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ message: 'Book not found or not deleted' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
