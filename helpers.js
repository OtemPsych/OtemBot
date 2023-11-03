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
        const filteredSongs = queue.songs.slice(queue.songs.findIndex(item => item.id === song.id));
        const queueDuration = filteredSongs
            .map(song => song.duration)
            .reduce((accumulator, duration) => accumulator + duration, 0);

        return new EmbedBuilder()
            .setColor(module.exports.sourceToHex(song.source))
            .setTitle(song.name)
            .setURL(song.url)
            .setAuthor({ name: `${emoji.music} Now playing ${emoji.music}` })
            .addFields(
                { name: 'Request', value: `${song.user}`, inline: true },
                { name: 'Duration', value: `${song.formattedDuration}`, inline: true },
                { name: 'Queue', value: `${filteredSongs.length} song${filteredSongs.length > 1 ? 's' : ''} - ${module.exports.formatDuration(queueDuration)}`, inline: true },
                { name: 'Volume', value: `${queue.volume}%` }
            )
            .setImage(song.thumbnail)
            .setTimestamp()
            .setFooter({ text: 'From OtemBot' });
    }
};