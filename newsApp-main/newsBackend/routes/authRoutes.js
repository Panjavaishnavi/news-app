// File: routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, registerUser } = require('../controllers/authController'); // Import registerUser
const { check } = require('express-validator');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
    '/signup',
    [
        check('name', 'Name is required').notEmpty(),
        check('username', 'Username is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    registerUser // Use the new controller function
);


// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post(
    '/login',
    [
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password is required').notEmpty(),
    ],
    login
);

module.exports = router;