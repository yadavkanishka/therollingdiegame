const gameModel = require('../models/gameModel');

function showInventory(req, res) {
    const games = gameModel.getAllGames();

    res.render('public/inventory', {
        games: games
    });
}

module.exports = {
    showInventory
};