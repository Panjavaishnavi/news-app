const express = require('express');
const router = express.Router();
const {
    getNews,
    getNewsById,
    getNewsByCategory,
    createNews,
    updateNews,
    deleteNews,
} = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// @route   GET /api/news
// @desc    Get all news
// @access  Public
router.get('/', getNews);

// @route   GET /api/news/:id
// @desc    Get news by ID
// @access  Public
router.get('/:id', getNewsById);

// @route   GET /api/news/category/:id
// @desc    Get news by category
// @access  Public
router.get('/category/:id', getNewsByCategory);

// @route   POST /api/news
// @desc    Create news
// @access  Private/Admin
router.post(
    '/',
    [
        protect,
        admin,
        check('title', 'Title is required').notEmpty(),
        check('description', 'Description is required').notEmpty(),
        check('category_id', 'Category ID is required').notEmpty(),
    ],
    createNews
);

// @route   PUT /api/news/:id
// @desc    Update news
// @access  Private/Admin
router.put(
    '/:id',
    [
        protect,
        admin,
        check('title', 'Title is required').notEmpty(),
        check('description', 'Description is required').notEmpty(),
        check('category_id', 'Category ID is required').notEmpty(),
    ],
    updateNews
);

// @route   DELETE /api/news/:id
// @desc    Delete news
// @access  Private/Admin
router.delete('/:id', [protect, admin], deleteNews);

module.exports = router;