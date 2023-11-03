const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect the bot from the voice channel.'),
    async execute(interaction) {
        interaction.reply('Disconnecting from voice channel.');
        interaction.client.distube.voices.leave(interaction);
    },
};