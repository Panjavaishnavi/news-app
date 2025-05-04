const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    findByUsername: async (username) => {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, name, username, email, role FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (userData) => {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [userData.name, userData.username, userData.email, hashedPassword, userData.role || 'user']
        );

        return {
            id: result.insertId,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            role: userData.role || 'user'
        };
    },

    comparePassword: async (enteredPassword, storedPassword) => {
        return await bcrypt.compare(enteredPassword, storedPassword);
    }
};

module.exports = User;