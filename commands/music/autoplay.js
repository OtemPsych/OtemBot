const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle queue autoplay which continues playing related songs once the queue is empty.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const autoplayStatus = queue.toggleAutoplay();

        if (autoplayStatus) {
            interaction.reply(`Autoplay turned on. The bot will continue playing related songs.`);
        } else {
            interaction.reply(`Autoplay turned off. The bot will stop playing songs once the queue is empty.`);
        }
    },
};