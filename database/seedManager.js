const bcrypt = require('bcryptjs');
const db = require('./database');

const username = 'manager';
const password = 'RollingDie123!';

const hashedPassword = bcrypt.hashSync(password, 10);

const existingUser = db.prepare(`
    SELECT id
    FROM users
    WHERE username = ?
`).get(username);

if (existingUser) {
    console.log('Manager account already exists.');
} else {
    db.prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `).run(username, hashedPassword);

    console.log('Manager account created.');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
}

db.close();