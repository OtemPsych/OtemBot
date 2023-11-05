const { SlashCommandBuilder } = require('discord.js');
const { formatDuration } = require('../../helpers');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Jump to a specific time in the song.')
        .addStringOption(option =>
            option.setName('timestamp')
                .setDescription('The time to skip to in the format H:M:S or M:S (for example, 2:53).')
                .setRequired(true)),
    async execute(interaction) {        
        const timeParts = interaction.options.getString('timestamp')
            .trim()
            .split(':')
            .map(part => parseInt(part, 10))
            .filter(part => Number.isInteger(part));

        if (timeParts.length !== 2 && timeParts.length !== 3) {
            return interaction.reply({
                content: 'Please enter a valid timestamp in the format H:M:S or M:S (for example, 2:53).',
                ephemeral: true,
            });
        }

        const totalSeconds = (timeParts.length === 3)
            ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
            : timeParts[0] * 60 + timeParts[1];
        
        interaction.reply(`Seeking to \`${formatDuration(totalSeconds)}\`.`);

        const queue = interaction.client.distube.getQueue(interaction.guildId);
        queue.seek(totalSeconds);
    },
};