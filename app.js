const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');

const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');

const app = express();
const PORT = 3000;

// Configure Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

// Serve static files
app.use(express.static('public'));

//parse form submissions 
app.use(express.urlencoded({ extended: false }));

//Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'rolling-die-development-secret',
    resave: false,
    saveUninitialized: false
}));

// Public home page
app.get('/', function(req, res) {
    res.render('public/home');
});

//Authentication routes
app.use(authRoutes);

// Game routes
app.use(gameRoutes);

// Manager routes
app.use(managerRoutes);

// Start server
app.listen(PORT, function() {
    console.log(`The Rolling Die server is running at http://localhost:${PORT}`);
});