const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { sourceToHex, playSongEmbed } = require('./helpers');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});
client.lastInteractionMap = new Map();

// Load DisTube
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: false,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin(),
    ],
});

// Load commmand files
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}.`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`[ERROR] No command matching ${interaction.commandName} was found.`);
        return;
    }

    // Apply custom guards
    if (command.requiresVoiceChannel && !interaction.member.voice.channel) {
        return await interaction.reply({
            content: 'You must be in a voice channel to run this command.',
            ephemeral: true,
        });
    }
    if (command.requiresNonEmptyQueue && !client.distube.getQueue(interaction.guild.id)) {
        return await interaction.reply({
            content: 'There are no songs in the queue.',
            ephemeral: true,
        });
    }

    // Execute the command
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.distube
    .on('playSong', async (queue, song) => {
        const interaction = client.lastInteractionMap.get(queue.id);
        if (interaction.replied) { // The reply was sent on adding the song to the queue
            await interaction.channel.send({ embeds: [playSongEmbed(queue, song)], flags: [ 4096 ] });
        } else {
            await interaction.editReply({ embeds: [playSongEmbed(queue, song)] });
        }
    })
    .on('addSong', async (queue, song) => {
        const addEmbed = new EmbedBuilder()
            .setColor(sourceToHex(song.source))
            .setTitle(song.name)
            .setURL(song.url)
            .setAuthor({ name: `Added to the queue (#${queue.songs.length})` })
            .setThumbnail(song.thumbnail)
            .addFields(
                { name: 'Request', value: `${song.user}`, inline: true },
                { name: 'Duration', value: `\`${song.formattedDuration}\``, inline: true },
                { name: 'Queue', value: `${queue.songs.length} song${queue.songs.length > 1 ? 's' : ''} - \`${queue.formattedDuration}\``, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'From OtemBot' });
            
        const interaction = client.lastInteractionMap.get(queue.id);
        await interaction.editReply({ embeds: [addEmbed] });
    });

client.login(token);