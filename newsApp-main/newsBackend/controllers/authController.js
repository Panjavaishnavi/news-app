// File: controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, username, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findByUsername(username);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            username,
            email,
            password, // Password hashing is handled in the User model's create method
            // role defaults to 'user' in the User model's create method
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user), // Optionally generate token on signup
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Check for user
        const user = await User.findByUsername(username);

        if (!user) {
            console.log('username');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await User.comparePassword(password, user.password);

        if (!isMatch) {
            console.log('password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    login,
    registerUser, // Export the new function
};