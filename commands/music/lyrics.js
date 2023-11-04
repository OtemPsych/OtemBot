const { SlashCommandBuilder } = require('discord.js');
const { geniusToken } = require('../../config.json');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Fetch the lyrics to the song currently playing.'),
    expandElement($, el) {
        return $(el).contents().map(function() {
            return (this.type === 'text') ? $(this).text() + '\n' : module.exports.expandElement($, this) + '\n';
        }).get().join('');
    },
    async fetchSongUrl(songId) {
        try {
            const response = await axios.get(`https://api.genius.com/songs/${songId}`, {
                headers: {
                    Authorization: `Bearer ${geniusToken}`,
                },
            });
            return response.data.response.song.url;
        } catch {
            return '';
        }
    },
    async fetchParseLyrics(lyricsUrl) {
        try {
            const response = await axios.get(lyricsUrl);
            const $ = cheerio.load(response.data);

            return module.exports.expandElement($, '.Lyrics__Container-sc-1ynbvzw-1')
                .split('\n')
                .filter((line, index, array) => {
                    if (index === 0 || index === array.length - 1) {
                        return true;
                    }
                    
                    const trimmedLine = line.trim();
                    const prevLine = array[index - 1].trim();
                    const nextLine = array[index + 1].trim();

                    if (trimmedLine === '' && prevLine !== '' && nextLine !== '') {
                        return false;
                    }
                    if (trimmedLine === '' && nextLine === '') {
                        return false;
                    }
                    return true;
                })
                .join('\n');
        } catch {
            return '';
        }
    },
    findBestHit(hits) {
        if (hits.length > 0) {
            const hitComponents = hits[0].result.path.split('-');
            if (hitComponents[hitComponents.length - 1] === 'lyrics') {
                return hits[0];
            }
        }
        return null;
    },
    async execute(interaction) {
        await interaction.deferReply();

        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const songName = queue.songs[0].name;

        let lyrics = '';
        let geniusQuery = songName.toLowerCase().split(' ');
        let songUrl = '';
        while (lyrics === '' && geniusQuery.length > 0) {
            const response = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(geniusQuery.join(' '))}`, {
                headers: {
                    Authorization: `Bearer ${geniusToken}`,
                },
            });
            const bestHit = module.exports.findBestHit(response.data.response.hits);
            if (bestHit !== null) {
                const songId = bestHit.result.id;
                songUrl = await module.exports.fetchSongUrl(songId);
                if (songUrl !== '') {
                    lyrics = await module.exports.fetchParseLyrics(songUrl);
                }
            } else {
                geniusQuery = geniusQuery.slice(0, geniusQuery.length - 1);
            }
        }

        if (lyrics === '') {
            interaction.editReply(`The lyrics for ${songName} weren't found.`);
        } else {
            interaction.editReply({
                files: [{
                    attachment: Buffer.from(`"${songName}" - Lyrics\nParsed from: ${songUrl}\n\n${lyrics}`),
                    name: `${songName}_lyrics.txt`,
                }]
            });
        }
    },
};