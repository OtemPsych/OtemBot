const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    data: new SlashCommandBuilder()
        .setName('playskip')
        .setDescription('Skip the current song and start playing another one by providing a query or a URL.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('A YouTube/SoundCloud/Spotify URL or a query to search and play.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        interaction.client.lastInteractionMap.set(interaction.guildId, interaction);
        
        const query = interaction.options.getString('query');
        interaction.client.distube.play(interaction.member.voice.channel, query, {
            member: interaction.member,
            textChannel: interaction.channel,
            skip: true,
        });
    },
};