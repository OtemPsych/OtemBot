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
        const skipCount = interaction.options.getInteger('count') ?? 1;

        if (skipCount >= queue.songs.length) {
            const replyStr = `Skipping ${(queue.songs.length > 1) ? `${queue.songs.length} songs` : `\`${queue.songs[0].name}\``}.`;

            if (queue.autoplay) {
                interaction.reply(replyStr);
                return queue.skip();
            }
            interaction.reply(`${replyStr} There are no more songs in the queue.`);
            return queue.stop();
        }

        await interaction.deferReply();
        interaction.client.lastInteractionMap.set(queue.id, interaction);

        await queue.jump(skipCount);
        if (queue.paused) {
            queue.resume();
        }
    },
};