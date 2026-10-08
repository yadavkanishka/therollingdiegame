function requireManager(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.redirect('/login');
    }

    next();
}

module.exports = {
    requireManager
};
