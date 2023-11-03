const { SlashCommandBuilder } = require('discord.js');
const { playSongEmbed } = require('../../helpers');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('song')
        .setDescription('Show the song currently playing.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        interaction.reply({
            embeds: [playSongEmbed(queue, queue.songs[0])],
            ephemeral: true,
        });
    },
};