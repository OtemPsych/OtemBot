const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play the previous song or specify a number to jump back multiple songs.')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('How many songs to jump back, the previous song is played if the count isn\'t specified.')
                .setMinValue(1)),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const jumpCount = interaction.options.getInteger('count') ?? 1;

        if (queue.previousSongs.length < jumpCount) {
            return interaction.reply({
                content: `Sorry, there aren't enough previous songs to jump back ${jumpCount} song${jumpCount > 1 ? 's' : ''}.`,
                ephemeral: true,
            });
        }
          
        await interaction.deferReply();
        interaction.client.interactionsMap.set(queue.id, interaction);

        await queue.jump(-jumpCount);
        if (queue.paused) {
            queue.resume();
        }
    },
};