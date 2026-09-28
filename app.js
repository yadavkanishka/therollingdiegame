const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();
const PORT = 3000;

// Configure Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

// Serve static files
app.use(express.static('public'));

// Public home page
app.get('/', function(req, res) {
    res.render('public/home');
});

// Start server
app.listen(PORT, function() {
    console.log(`The Rolling Die server is running at http://localhost:${PORT}`);
});