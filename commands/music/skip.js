const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips to the next song in the queue.'),
    async execute(interaction) {        
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const currentSongName = queue.songs[0].name;
        
        await interaction.deferReply();
        interaction.client.interactionsMap.set(queue.id, interaction);

        try {
            await queue.skip();
            if (queue.paused) {
                queue.resume();
            }
        } catch {
            interaction.editReply(`Skipping \`${currentSongName}\`.`);
            queue.stop();
        }
    },
};