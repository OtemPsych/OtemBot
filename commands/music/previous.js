const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Plays the previous song in the queue.'),
    async execute(interaction) {    
        const queue = interaction.client.distube.getQueue(interaction.guild.id);

        if (queue.previousSongs.length === 0) {
            return interaction.reply({
                content: 'There is no previous song in the queue.',
                ephemeral: true,
            });
        }

        await interaction.deferReply();
        interaction.client.interactionsMap.set(queue.id, interaction);
        
        queue.previous();
    },
};