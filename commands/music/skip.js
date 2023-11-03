const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Advance to the next song or specify a number to skip multiple songs at once.')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('How many songs to skip, the next song is played if the count isn\'t specified.')
                .setMinValue(1)),
    async execute(interaction) {        
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const currentSongName = queue.songs[0].name;
        const skipCount = interaction.options.getInteger('count') ?? 1;
        const actualSkipCount = Math.min(skipCount, queue.songs.length);

        if (queue.songs.length - 1 < skipCount) {
            interaction.reply(`Skipping ${actualSkipCount > 1 ? `${actualSkipCount} songs` : `\`${currentSongName}\``}. There are no more songs in the queue.`);
            queue.stop();
            return;
        }

        await interaction.deferReply();
        interaction.client.interactionsMap.set(queue.id, interaction);

        await queue.jump(skipCount);
        if (queue.paused) {
            queue.resume();
        }
    },
};