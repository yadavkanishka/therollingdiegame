require('dotenv').config();

const express = require('express');
const http = require('http');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const { Server } = require('socket.io');

const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');
const { startBot } = require('./bot/bot');

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server);

// Configure Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

// Serve static files
app.use(express.static('public'));

//parse form submissions 
app.use(express.urlencoded({ extended: false }));

//Configure sessions
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'rolling-die-development-secret',
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware); 

// Share Express sessions with Socket.IO.

io.engine.use(sessionMiddleware);

// Allow only authenticated managers to connect to the dashboard socket.

io.use((socket, next) => {

    const session = socket.request.session;

    if (session && session.userId) {

        return next();

    }

    next(new Error('Unauthorized: manager login required.'));

});

// Put authenticated managers in a room for dashboard notifications.

io.on('connection', socket => {

    socket.join('manager');

    console.log('Manager dashboard connected to live updates.');

    socket.on('disconnect', () => {

        console.log('Manager dashboard disconnected.');

    });

});

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
server.listen(PORT, () => {
    console.log(`The Rolling Die server is running at http://localhost:${PORT}`);
    startBot(io);
});