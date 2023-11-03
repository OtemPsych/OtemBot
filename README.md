# OtemBot

An educational project that uses a Discord bot that can play music in a voice channel by providing a query to search and play a YouTube video, or by directly providing a YouTube/SoundCloud/Spotify URL. This bot uses [Discord.js 14](https://discord.js.org/) and [DisTube.js](https://distube.js.org/#/) to provide music playback in a Discord server.

## Features

* Play music from YouTube, SoundCloud or Spotify.
* Queue up multiple songs and manage the playback.
* Volume control to adjust the bot's volume in the voice channel.
* Skip, pause, resume and stop playback.
* Seek to a specific timestamp in the song.
* Shuffle the enqueued songs.

## Commands

* `/disconnect`: Disconnects the bot from the voice channel.
* `/help`: Lists all commands available.
* `/pause`: Pauses the current song.
* `/play <query>`: Plays a song by providing a query or a URL.
* `/playskip <query>`: Skips the current song and starts playing another one by providing a query or a URL.
* `/previous`: Plays the previous song in the queue.
* `/queue`: Shows the queued songs.
* `/resume`: Resumes the paused song.
* `/seek <timestamp>`: Jumps to a specific time in the song.
* `/shuffle`: Shuffles the songs in the queue.
* `/skip`: Skips to the next song in the queue.
* `/song`: Shows the song currently playing.
* `/stop`: Stops playing the current song and removes all songs from the queue.
* `/volume <volume>`: Sets the bot's volume for the server.

## Dependencies

* Node Package Manager (NPM)
* Node.js
* @discordjs/opus
* @discordjs/voice
* @distube/soundcloud
* @distube/spotify
* @distube/yt-dlp
* discord.js
* distube
* ffmpeg-static
* libsodium-wrappers

## Installation

1. Install [Node.js and NPM](https://nodejs.org/en/download).

2. Create your Discord bot by following this [tutorial](https://discord.com/developers/docs/getting-started).

3. Clone the repository:
```bash
git clone git@github.com:OtemPsych/OtemBot.git
```

4. Navigate to the project directory:
```bash
cd OtemBot
```

5. Install dependencies:
```bash
npm install
```

6. Create a `config.json` file by modifying the `config.example.json` provided:
```json
{
    "token": "<YOUR BOT'S TOKEN HERE>",
    "clientId": "<YOUR BOT'S APPLICATION ID HERE>",
    "guildId": "<OPTIONALLY ADD THE SERVER ID OF YOUR DEVELOPMENT SERVER HERE>",
    "colors": {
        "soundcloud": "#F26F23",
        "youtube": "#EF3E3E",
        "spotify": "#1ED760"
    },
    "emoji": {
        "music": "♪"
    }
}
```

8. Invite the bot to your server by using the following link (change the `client_id` beforehand):
```
https://discord.com/api/oauth2/authorize?client_id=<YOUR BOT'S APPLICATION ID HERE>&permissions=36703232&scope=bot%20applications.commands
```

7. Deploy the bot commands and run the bot:
```bash
node deploy-commands.js
node index.js
```