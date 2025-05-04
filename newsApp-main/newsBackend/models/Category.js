const pool = require('../config/db');

const Category = {
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM categories');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (title) => {
        const [result] = await pool.query(
            'INSERT INTO categories (title) VALUES (?)',
            [title]
        );

        return {
            id: result.insertId,
            title
        };
    },

    update: async (id, title) => {
        await pool.query(
            'UPDATE categories SET title = ? WHERE id = ?',
            [title, id]
        );

        return {
            id: parseInt(id),
            title
        };
    },

    delete: async (id) => {
        const [result] = await pool.query(
            'DELETE FROM categories WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Category;