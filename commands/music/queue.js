const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the queued songs.'),
    async execute(interaction) {
        const limit = 2000;
        const queue = interaction.client.distube.getQueue(interaction.guildId);

        let limitReached = false;
        let result = '';
        for (const [i, song] of queue.songs.entries()) {
            const songString = `${i === 0 ? 'Playing:' : `${i + 1}.`} [${song.name}](<${song.url}>) - ${song.formattedDuration}`;
            if ((result.length + songString.length) <= limit) {
                result += `${songString}\n`;
            } else {
                limitReached = true;
                break;
            }
        }
        if (limitReached) {
            result += '...';
        }

        interaction.reply({
            content: result,
            ephemeral: true,
        });
    },
};