const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the songs in the queue.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        if (queue.songs.length <= 2) {
            return interaction.reply({
                content: 'A queue can only be shuffled when there are at least 3 songs in the queue.',
                ephemeral: true,
            });
        }

        interaction.reply('Shuffling the songs in the queue.');
        queue.shuffle();
    },
};