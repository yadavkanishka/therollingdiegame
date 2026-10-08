const gameModel = require('../models/gameModel');

function showDashboard(req, res) {
    const games = gameModel.getAllGames();

    res.render('manager/dashboard', {
        username: req.session.username,
        games: games
    });
}

function showAddGame(req, res) {
    res.render('manager/game-form', {
        pageTitle: 'Add a Game',
        formAction: '/manager/games/add',
        game: null,
        error: null
    });
}

function addGame(req, res) {
    const { title, description, category, price, stock } = req.body;

    if (
        !title?.trim() ||
        !description?.trim() ||
        !category?.trim() ||
        price === '' ||
        stock === '' ||
        !Number.isFinite(Number(price)) ||
        !Number.isInteger(Number(stock)) ||
        Number(price) < 0 ||
        Number(stock) < 0
    ) {
        return res.status(400).render('manager/game-form', {
            pageTitle: 'Add a Game',
            formAction: '/manager/games/add',
            game: req.body,
            error: 'Enter valid game details, a non-negative price, and a whole-number stock quantity.'
        });
    }

    gameModel.createGame(
        title.trim(),
        description.trim(),
        category.trim(),
        Number(price),
        Number(stock)
    );

    res.redirect('/manager');
}

function showEditGame(req, res) {
    const game = gameModel.getGameById(Number(req.params.id));

    if (!game) {
        return res.status(404).send('Game not found.');
    }

    res.render('manager/game-form', {
        pageTitle: 'Edit Game',
        formAction: `/manager/games/${game.id}/edit`,
        game: game,
        error: null
    });
}

function editGame(req, res) {
    const id = Number(req.params.id);
    const existingGame = gameModel.getGameById(id);

    if (!existingGame) {
        return res.status(404).send('Game not found.');
    }

    const { title, description, category, price, stock } = req.body;

    if (
        !title?.trim() ||
        !description?.trim() ||
        !category?.trim() ||
        price === '' ||
        stock === '' ||
        !Number.isFinite(Number(price)) ||
        !Number.isInteger(Number(stock)) ||
        Number(price) < 0 ||
        Number(stock) < 0
    ) {
        return res.status(400).render('manager/game-form', {
            pageTitle: 'Edit Game',
            formAction: `/manager/games/${id}/edit`,
            game: { ...req.body, id },
            error: 'Enter valid game details, a non-negative price, and a whole-number stock quantity.'
        });
    }

    gameModel.updateGame(
        id,
        title.trim(),
        description.trim(),
        category.trim(),
        Number(price),
        Number(stock)
    );

    res.redirect('/manager');
}
function deleteGame(req, res) {
    const id = Number(req.params.id);
    const game = gameModel.getGameById(id);

    if (!game) {
        return res.status(404).send('Game not found.');
    }

    gameModel.deleteGame(id);

    res.redirect('/manager');
}

module.exports = {
    showDashboard,
    showAddGame,
    addGame,
    showEditGame,
    editGame,
    deleteGame
};