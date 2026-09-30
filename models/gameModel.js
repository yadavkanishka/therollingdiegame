const db = require('../database/database');

function getAllGames() {
    return db.prepare(`
        SELECT *
        FROM games
        ORDER BY title ASC
    `).all();
}

module.exports = {
    getAllGames
};