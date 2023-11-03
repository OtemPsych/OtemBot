const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all commands available.'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Commands')
            .addFields(
                interaction.client.commands
                    .sort((a, b) => a.data.name.localeCompare(b.data.name))
                    .map(cmd => ({
                        name: `/${cmd.data.name}`,
                        value: cmd.data.description
                    }))
            );

        interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true,
        });
    },
};