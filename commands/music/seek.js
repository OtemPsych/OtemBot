const { SlashCommandBuilder } = require('discord.js');
const { formatDuration } = require('../../helpers');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Jumps to a specific time in the song.')
        .addStringOption(option =>
            option.setName('timestamp')
                .setDescription('The time to skip to in the format H:M:S (for example, 2:53).')
                .setRequired(true)),
    async execute(interaction) {        
        const timeParts = interaction.options.getString('timestamp')
            .trim()
            .split(':')
            .map(part => parseInt(part, 10))
            .filter(part => Number.isInteger(part));

        let totalSeconds = 0;
        if (timeParts.length === 3) {
            totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        } else if (timeParts.length === 2) {
            totalSeconds = timeParts[0] * 60 + timeParts[1];
        } else {
            return interaction.reply({
                content: 'Please enter a valid timestamp in the format H:M:S (for example, 2:53).',
                ephemeral: true,
            });
        }
        
        interaction.reply(`Seeking to \`${formatDuration(totalSeconds)}\`.`);

        const queue = interaction.client.distube.getQueue(interaction.guildId);
        queue.seek(totalSeconds);
    },
};