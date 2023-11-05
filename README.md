# OtemBot

An educational project of a Discord bot that can play music in a voice channel by providing a query to search and play a YouTube video, or by directly providing a YouTube/SoundCloud/Spotify URL. This bot uses [Discord.js 14](https://discord.js.org/) and [DisTube.js](https://distube.js.org/#/) to provide music playback in a Discord server.

## Features

* Play music from YouTube, SoundCloud or Spotify.
* Queue up multiple songs and manage the playback.
* Volume control to adjust the bot's volume in the voice channel.
* Skip, pause, resume and stop playback.
* Seek to a specific timestamp in the song.
* Fetch the lyrics to the song currently playing.
* Shuffle the enqueued songs.
* Continue playing related songs when the queue is empty after enabling autoplay.

## Images

### Adding songs to the queue

![image](https://github.com/OtemPsych/OtemBot/assets/8961693/b3caf997-80c8-421e-b643-9869a3ca0d31)

![image](https://github.com/OtemPsych/OtemBot/assets/8961693/4d088065-2df0-4e56-ae7a-803e56514fca)

## Commands

* `/autoplay`: Toggle queue autoplay which continues playing related songs once the queue is empty.
* `/disconnect`: Disconnect the bot from the voice channel.
* `/help`: List all commands available.
* `/lyrics`: Fetch the lyrics to the song currently playing.
* `/pause`: Pause the current song.
* `/play <query>`: Play a song by providing a query or a URL.
* `/playskip <query>`: Skip the current song and start playing another one by providing a query or a URL.
* `/previous [count]`: Play the previous song or specify a number to jump back multiple songs.
* `/queue`: Show the queued songs.
* `/resume`: Resume the paused song.
* `/seek <timestamp>`: Jump to a specific time in the song.
* `/shuffle`: Shuffle the songs in the queue.
* `/skip [count]`: Advance to the next song or specify a number to skip multiple songs at once.
* `/song`: Show the song currently playing.
* `/stop`: Stop playing the current song and remove all songs from the queue.
* `/volume <volume>`: Set the bot's volume for the server.

## Dependencies

* Node Package Manager (NPM)
* Node.js
* [axios](https://www.npmjs.com/package/axios)
* [cheerio](https://www.npmjs.com/package/cheerio)
* [@discordjs/opus](https://www.npmjs.com/package/@discordjs/opus)
* [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)
* [@distube/soundcloud](https://www.npmjs.com/package/@distube/soundcloud)
* [@distube/spotify](https://www.npmjs.com/package/@distube/spotify)
* [@distube/yt-dlp](https://www.npmjs.com/package/@distube/yt-dlp)
* [discord.js](https://discord.js.org/)
* [distube](https://distube.js.org/#/)
* [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static)
* [libsodium-wrappers](https://www.npmjs.com/package/libsodium-wrappers)

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
    "geniusToken": "<YOUR GENIUS TOKEN FOR FETCHING SONG LYRICS (ACCOUNT NEEDED)>",
    ...
}
```

7. Invite the bot to your server by using the following link (change the `client_id` beforehand):
```
https://discord.com/api/oauth2/authorize?client_id=<YOUR BOT'S APPLICATION ID HERE>&permissions=36703232&scope=bot%20applications.commands
```

8. Deploy the bot commands and run the bot:
```bash
node deploy-commands.js
node index.js
```
