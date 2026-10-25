# The Rolling Die

The Rolling Die is a board game inventory management application built with Node.js, Express, Mustache, SQLite, Discord.js, and Socket.IO.

## Features

- Public board game inventory (no login needed).
- Manager login and protected dashboard.
- Add, edit, and delete games.
- SQLite database for persistent inventory storage.
- Discord slash commands to search games and check prices and stock.
- Real-time manager dashboard updates using Socket.IO.

## Technologies

- Node.js, Express, Mustache
- SQLite and better-sqlite3
- express-session and bcryptjs
- Discord.js
- Socket.IO

## Setup

1. Install Node.js and npm.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a file named `.env` in the project root with:

   ```
   DISCORD_TOKEN=your_bot_token
   DISCORD_CLIENT_ID=your_application_id
   DISCORD_GUILD_ID=your_server_id
   SESSION_SECRET=any_long_random_string
   ```

   - Create the bot at https://discord.com/developers/applications.
   - The token is under Bot → Reset Token.
   - The client ID is the Application ID on the General Information page.
   - The guild ID is your server's ID (turn on Developer Mode in Discord, then right-click the server → Copy Server ID).
   - Invite the bot to your server using the OAuth2 URL Generator with the `bot` and `applications.commands` scopes.

5. Initialize the database (run from the project root):

   ```bash
   node database/init.js
   node database/seed.js
   node database/seedManager.js
   ```

   `init.js` creates the tables, `seed.js` adds sample games, and `seedManager.js` creates the manager account.

6. Register the Discord slash commands (only needed once, or when commands change):

   ```bash
   node bot/commands/registerCommands.js
   ```

7. Start the application (web server and bot run together):

   ```bash
   node app.js
   ```

8. Open http://localhost:3000

## Using the app

- Public inventory: http://localhost:3000/inventory
- Manager login: http://localhost:3000/login
  - Username: `manager`
  - Password: `RollingDie123!`
- Manager dashboard: http://localhost:3000/manager (add, edit, delete games and watch live bot activity)

## Discord commands

Each command takes a required `title` argument:

- `/game-search title:<game>`: description, category, price, and stock
- `/game-price title:<game>`: price of a game
- `/game-stock title:<game>`: current stock of a game

The bot reads the database on every command, so changes made in the manager area show up immediately. Each command also pushes a live update to the manager dashboard over Socket.IO.

## Notes

- Always run commands from the project root, because the database path is relative (`./database/rollingdie.db`).
- `.env` and the database file are not committed. Create them using the steps above.