const db = require('./database');

const games = [
    {
        title: 'Wingspan',
        description: 'A competitive bird-collection and engine-building game.',
        category: 'Strategy',
        price: 69.99,
        stock: 4
    },
    {
        title: 'Catan',
        description: 'A classic strategy game about trading and building settlements.',
        category: 'Strategy',
        price: 54.99,
        stock: 7
    },
    {
        title: 'Azul',
        description: 'A tile-placement game inspired by Portuguese decorative tiles.',
        category: 'Family',
        price: 44.99,
        stock: 3
    }
];

const insert = db.prepare(`
    INSERT INTO games (title, description, category, price, stock)
    VALUES (?, ?, ?, ?, ?)
`);

const insertMany = db.transaction(function(games) {
    for (const game of games) {
        insert.run(
            game.title,
            game.description,
            game.category,
            game.price,
            game.stock
        );
    }
});

insertMany(games);

console.log(`${games.length} games added to the database.`);

db.close();