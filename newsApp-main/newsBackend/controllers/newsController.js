const News = require('../models/News');
const { validationResult } = require('express-validator');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
    try {
        const news = await News.findAll();
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get news by category
// @route   GET /api/news/category/:id
// @access  Public
const getNewsByCategory = async (req, res) => {
    try {
        const news = await News.findByCategory(req.params.id);
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newsData = {
            ...req.body,
            user_id: req.user.id
        };

        const news = await News.create(newsData);
        res.status(201).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        const updatedNews = await News.update(req.params.id, req.body);
        res.json(updatedNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        const success = await News.delete(req.params.id);

        if (success) {
            res.json({ message: 'News removed' });
        } else {
            res.status(500).json({ message: 'Failed to delete news' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNews,
    getNewsById,
    getNewsByCategory,
    createNews,
    updateNews,
    deleteNews,
};
