const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing the current song and remove all songs from the queue.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const songName = queue.songs[0].name;
        
        interaction.reply(`Stopping \`${songName}\` and clearing the queue.`);
        queue.stop();
    },
};