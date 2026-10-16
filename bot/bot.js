require('dotenv').config();

const { Client, GatewayIntentBits, Events } = require('discord.js');

const gameModel = require('../models/gameModel');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Discord bot logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const commandName = interaction.commandName;
    const title = interaction.options.getString('title', true).trim();

    try {
        // Retrieve current database data for every command.
        // No game inventory is cached.
        const games = gameModel.getAllGames();

        const game = games.find(
            item => item.title.toLowerCase() === title.toLowerCase()
        );

        if (!game) {
            await interaction.reply({
                content: `Sorry, I couldn't find a game titled "${title}".`,
                ephemeral: true
            });
            return;
        }

        let response;

        if (commandName === 'game-search') {
            response =
                `**${game.title}**\n` +
                `${game.description}\n` +
                `Category: ${game.category}\n` +
                `Price: $${Number(game.price).toFixed(2)}\n` +
                `Stock: ${game.stock}`;
        } else if (commandName === 'game-price') {
            response =
                `**${game.title}** costs $${Number(game.price).toFixed(2)}.`;
        } else if (commandName === 'game-stock') {
            response =
                `**${game.title}** currently has ${game.stock} unit(s) in stock.`;
        } else {
            return;
        }

        await interaction.reply({
            content: response,
            ephemeral: false
        });
    } catch (error) {
        console.error('Error handling Discord command:', error);

        const errorMessage =
            'Sorry, something went wrong while retrieving game information.';

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: errorMessage,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to log in to Discord:', error);
});