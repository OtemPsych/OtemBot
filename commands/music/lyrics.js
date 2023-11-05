const { SlashCommandBuilder } = require('discord.js');
const { geniusToken } = require('../../config.json');
const axios = require('axios');
const cheerio = require('cheerio');

axios.defaults.headers.common['Authorization'] = `Bearer ${geniusToken}`;

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Find the lyrics to the song currently playing.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription("Manually specify the song name and artist, in case the lyrics found weren't correct.")),
    async fetchLyrics(songName) {
        let queryParts = songName
            .replace(/\([^)]*\)/g, '')           // remove parentheses
            .replace(/\[[^\]]*\]/g, '')          // remove brackets
            .replace(/\{[^\}]*\]/g, '')          // remove accolades
            .replace(/\|[^|]*$/, '')             // remove anything after a '|' character
            .replace(/「[^」]*」/g, '')          // remove 「 and 」
            .replace(/\b(lyrics|lyric)\b/gi, '') // remove the words "lyric" and "lyrics"
            .split(' ')
            .filter(part => part.length > 0);

        while (queryParts.length > 0) {
            const query = encodeURIComponent(queryParts.join(' '));
            const hits = (await axios.get(`https://api.genius.com/search?q=${query}`)).data.response.hits;
            const bestHit = hits[0]?.result.path.endsWith('-lyrics') ? hits[0] : null;

            if (bestHit) {
                const songUrl = (await axios.get(`https://api.genius.com/songs/${bestHit.result.id}`)).data.response.song.url;
                if (songUrl) {
                    return await this.fetchParseLyrics(songUrl);
                }
            }
            queryParts.pop();
        }

        return null;
    },
    async fetchParseLyrics(lyricsUrl) {
        try {
            const response = await axios.get(lyricsUrl);
            const $ = cheerio.load(response.data);

            return this.expandElement($, '.Lyrics__Container-sc-1ynbvzw-1');
        } catch {
            return '';
        }
    },
    expandElement($, el) {
        return $(el)
            .contents()
            .map(function() {
                if (this.type === 'text') {
                    return $(this).text();
                } else if (this.name === 'br') {
                    return '\n';
                }
                return module.exports.expandElement($, this);
            })
            .get()
            .join('');
    },
    async execute(interaction) {
        await interaction.deferReply();

        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const songName = interaction.options.getString('name') ?? queue.songs[0].name;

        const lyrics = await this.fetchLyrics(songName);

        if (lyrics) {
            interaction.editReply({
                content: `Lyrics for \`${songName}\`:`,
                files: [{
                    attachment: Buffer.from(lyrics),
                    name: `${songName}_lyrics.txt`,
                }],
            });
        } else {
            interaction.editReply(`The lyrics for ${songName} weren't found.`);
        }
    },
};