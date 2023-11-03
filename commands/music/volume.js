const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiresVoiceChannel: true,
    requiresNonEmptyQueue: true,
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Sets the bot\'s volume for the server.')
        .addIntegerOption(option =>
                option.setName('percentage')
                    .setDescription('The percentage of the volume ranging from 1 to 100.')
                    .setMinValue(1)
                    .setMaxValue(100)
                    .setRequired(true)),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        const volume = interaction.options.getInteger('percentage');
        
        interaction.reply(`Setting volume to \`${volume}%\`.`);
        queue.setVolume(volume);
    },
};