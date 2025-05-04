const pool = require('../config/db');

const News = {
    findAll: async () => {
        const [rows] = await pool.query(`
      SELECT n.*, c.title as category_title, u.username as author 
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.user_id = u.id
      ORDER BY n.id DESC
    `);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(`
      SELECT n.*, c.title as category_title, u.username as author 
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.id = ?
    `, [id]);
        return rows[0];
    },

    findByCategory: async (categoryId) => {
        const [rows] = await pool.query(`
      SELECT n.*, c.title as category_title, u.username as author 
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.category_id = ?
      ORDER BY n.id DESC
    `, [categoryId]);
        return rows;
    },

    create: async (newsData) => {
        const [result] = await pool.query(
            'INSERT INTO news (title, description, image, category_id, user_id) VALUES (?, ?, ?, ?, ?)',
            [
                newsData.title,
                newsData.description,
                newsData.image,
                newsData.category_id,
                newsData.user_id
            ]
        );

        return {
            id: result.insertId,
            ...newsData
        };
    },

    update: async (id, newsData) => {
        await pool.query(
            'UPDATE news SET title = ?, description = ?, image = ?, category_id = ? WHERE id = ?',
            [
                newsData.title,
                newsData.description,
                newsData.image,
                newsData.category_id,
                id
            ]
        );

        return {
            id: parseInt(id),
            ...newsData
        };
    },

    delete: async (id) => {
        const [result] = await pool.query(
            'DELETE FROM news WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = News;