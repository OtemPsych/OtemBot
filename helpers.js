const { EmbedBuilder } = require('discord.js');
const { colors, emoji } = require('./config.json');

module.exports = {
    sourceToHex: (src) => {
        return colors[src] ?? '#0x009FF';
    },
    formatDuration: (seconds) => {
        const hours = parseInt(Math.floor(seconds / 3600));
        const minutes = parseInt(Math.floor((seconds % 3600) / 60));
        const remainingSeconds = parseInt(seconds % 60);

        const leadingHours = hours.toString().padStart(2, '0');
        const leadingMinutes = minutes.toString().padStart(2, '0');
        const leadingSeconds = remainingSeconds.toString().padStart(2, '0');

        return leadingHours === '00' ? `${leadingMinutes}:${leadingSeconds}` : `${leadingHours}:${leadingMinutes}:${leadingSeconds}`;
    },
    playSongEmbed: (queue, song) => {
        return new EmbedBuilder()
            .setColor(module.exports.sourceToHex(song.source))
            .setTitle(song.name)
            .setURL(song.url)
            .setAuthor({ name: `${emoji.music} Now playing ${emoji.music}` })
            .addFields(
                { name: 'Request', value: `${song.user}`, inline: true },
                { name: 'Duration', value: `${queue.currentTime > 0 ? `${queue.formattedCurrentTime} / ` : ''}${song.formattedDuration}`, inline: true },
                { name: 'Queue', value: `${queue.songs.length} song${queue.songs.length > 1 ? 's' : ''} - ${queue.formattedDuration}`, inline: true },
                { name: 'Volume', value: `${queue.volume}%` }
            )
            .setImage(song.thumbnail)
            .setTimestamp()
            .setFooter({ text: 'From OtemBot' });
    }
};