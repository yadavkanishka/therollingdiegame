const db = require('../database/database');

function findByUsername(username) {
    return db.prepare(`
        SELECT *
        FROM users
        WHERE username = ?
    `).get(username);
}

module.exports = {
    findByUsername
};