const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController');

router.get('/', auth, getBooks);
router.post('/', auth, createBook);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);

module.exports = router;
