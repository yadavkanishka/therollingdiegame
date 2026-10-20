require('dotenv').config();

const { Client, GatewayIntentBits, Events } = require('discord.js');
const gameModel = require('../models/gameModel');

function startBot(io) {
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
            // Read the current database for every command.
            // This prevents the bot from returning stale inventory data.
            const games = gameModel.getAllGames();

            const game = games.find(
                item => item.title.toLowerCase() === title.toLowerCase()
            );

            let response;
            let status;

            if (!game) {
                response = `Sorry, I couldn't find a game titled "${title}".`;
                status = 'not_found';

                await interaction.reply({
                    content: response,
                    ephemeral: true
                });
            } else if (commandName === 'game-search') {
                response =
                    `**${game.title}**\n` +
                    `${game.description}\n` +
                    `Category: ${game.category}\n` +
                    `Price: $${Number(game.price).toFixed(2)}\n` +
                    `Stock: ${game.stock}`;

                status = 'success';

                await interaction.reply({
                    content: response,
                    ephemeral: false
                });
            } else if (commandName === 'game-price') {
                response =
                    `**${game.title}** costs $${Number(game.price).toFixed(2)}.`;

                status = 'success';

                await interaction.reply({
                    content: response,
                    ephemeral: false
                });
            } else if (commandName === 'game-stock') {
                response =
                    `**${game.title}** currently has ${game.stock} unit(s) in stock.`;

                status = 'success';

                await interaction.reply({
                    content: response,
                    ephemeral: false
                });
            } else {
                return;
            }

            // Notify connected manager dashboards without a page refresh.
            io.to('manager').emit('botActivity', {
                command: commandName,
                title: title,
                status: status,
                message: response,
                timestamp: new Date().toLocaleTimeString()
            });

        } catch (error) {
            console.error('Error handling Discord command:', error);

            const errorMessage =
                'Sorry, something went wrong while retrieving game information.';

            try {
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
            } catch (replyError) {
                console.error('Could not send Discord error response:', replyError);
            }
        }
    });

    client.login(process.env.DISCORD_TOKEN).catch(error => {
        console.error('Failed to log in to Discord:', error);
    });

    return client;
}

module.exports = { startBot };