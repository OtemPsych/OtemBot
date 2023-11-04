const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { geniusToken, colors } = require('../../config.json');
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
    async execute(interaction) {
        await interaction.deferReply();

        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const songName = queue.songs[0].name;

        let lyrics = '';
        let lyricsUrl = '';
        let geniusQuery = songName.toLowerCase().split(' ');
        while (lyrics === '' && geniusQuery.length > 0) {
            const response = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(geniusQuery.join(' '))}`, {
                headers: {
                    Authorization: `Bearer ${geniusToken}`,
                },
            });
            const hits = response.data.response.hits;
            if (hits.length > 0) {
                const hitPathComponents = hits[0].result.path.split('-');
                if (hitPathComponents[hitPathComponents.length - 1] !== 'lyrics') {
                    geniusQuery = geniusQuery.slice(0, geniusQuery.length - 1);
                    continue;
                }

                const songId = hits[0].result.id;
                try {
                    const response = await axios.get(`https://api.genius.com/songs/${songId}`, {
                        headers: {
                            Authorization: `Bearer ${geniusToken}`,
                        },
                    });
                    lyricsUrl = response.data.response.song.url;

                    try {
                        const response = await axios.get(lyricsUrl);
                        const $ = cheerio.load(response.data);
                        let lyricsElement = module.exports.expandElement($, '.Lyrics__Container-sc-1ynbvzw-1')
                            .split('\n')
                            .filter((line, index, array) => {
                                if (index === 0 || index === array.length - 1) {
                                    // Keep the first and last lines as they can't have consecutive empty lines
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
                            }).join('\n');
                        console.log(lyricsElement);
                        lyrics = lyricsElement;
                    } catch {
                        lyrics = '';
                    }
                } catch {
                    lyricsUrl = '';
                }
            }

            geniusQuery = geniusQuery.slice(0, geniusQuery.length - 1);
        }

        if (lyrics === '') {
            interaction.editReply(`The lyrics for ${songName} weren't found.`);
        } else {
            interaction.editReply({
                files: [{
                    attachment: Buffer.from(`Lyrics for \`${songName}\`:\n\n${lyrics}`),
                    name: `${songName}_lyrics.txt`,
                }]
            });
        }
    },
};