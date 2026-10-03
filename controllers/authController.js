const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

function showLogin(req, res) {
    res.render('auth/login', {
        error: null
    });
}

function login(req, res) {
    const { username, password } = req.body;

    const user = userModel.findByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).render('auth/login', {
            error: 'Invalid username or password.'
        });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect('/manager');
}

function logout(req, res) {
    req.session.destroy(function() {
        res.redirect('/login');
    });
}

module.exports = {
    showLogin,
    login,
    logout
};