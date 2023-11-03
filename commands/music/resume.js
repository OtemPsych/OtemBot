const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const songName = queue.songs[0].name;

        if (!queue.paused) {
            return interaction.reply({
                content: `\`${songName}\` is already playing.`,
                ephemeral: true,
            });
        }

        interaction.reply(`Resuming \`${songName}\`.`);
        queue.resume();
    },
};