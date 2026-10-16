require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('game-search')
        .setDescription('Find a board game by title')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('The board game title')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('game-price')
        .setDescription('Check a board game price')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('The board game title')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('game-stock')
        .setDescription('Check current stock for a board game')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('The board game title')
                .setRequired(true)
        )
].map(command => command.toJSON());

async function registerCommands() {
    const rest = new REST({ version: '10' })
        .setToken(process.env.DISCORD_TOKEN);

    await rest.put(
        Routes.applicationGuildCommands(
            process.env.DISCORD_CLIENT_ID,
            process.env.DISCORD_GUILD_ID
        ),
        { body: commands }
    );

    console.log('Successfully registered all three slash commands.');
}

registerCommands().catch(error => {
    console.error('Failed to register slash commands:', error);
    process.exitCode = 1;
});