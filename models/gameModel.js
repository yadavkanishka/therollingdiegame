const db = require('../database/database');

function getAllGames() {
    return db.prepare(`
        SELECT *
        FROM games
        ORDER BY title ASC
    `).all();
}
function getGameById(id) {
    return db.prepare(`
        SELECT *
        FROM games
        WHERE id = ?
    `).get(id);
}

function createGame(title, description, category, price, stock) {
    return db.prepare(`
        INSERT INTO games (title, description, category, price, stock)
        VALUES (?, ?, ?, ?, ?)
    `).run(title, description, category, price, stock);
}

function updateGame(id, title, description, category, price, stock) {
    return db.prepare(`
        UPDATE games
        SET
            title = ?,
            description = ?,
            category = ?,
            price = ?,
            stock = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        title,
        description,
        category,
        price,
        stock,
        id
    );
}

function deleteGame(id) {
    return db.prepare(`
        DELETE FROM games
        WHERE id = ?
    `).run(id);
}

module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
};