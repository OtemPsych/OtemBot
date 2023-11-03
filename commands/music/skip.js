const { SlashCommandBuilder } = require('discord.js');
const { playSongEmbed } = require('../../helpers');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips to the next song in the queue.'),
    async execute(interaction) {        
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const lastSong = queue.songs[0];
        
        await interaction.deferReply();
        interaction.client.interactionsMap.set(queue.id, interaction);

        try {
            const nextSong = await queue.skip();
            if (lastSong.id === nextSong.id) { // needed as the 'playSong' callback isn't triggered when the same song is played in a row
                interaction.editReply({ embeds: [playSongEmbed(queue, nextSong)] });
            }
            if (queue.paused) {
                queue.resume();
            }
        } catch {
            interaction.editReply(`Skipping \`${lastSong.name}\`.`);
            queue.stop();
        }
    },
};