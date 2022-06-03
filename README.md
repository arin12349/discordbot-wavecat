# WaveCat
Discord Music bot

## Test video
 https://blog.naver.com/arin12349/222575346801

## features
- [x] find music
- [x] play music
- [x] stop music
- [x] skip music

## How to Use
 
 ### Download node.js 
 https://nodejs.org/en/
 
 ### Initiating a project folder and install discord.js
 open cmd on your project folder
 type this command
 ```
 npm init
 npm install discord.js
 ```
 ### Get discord token
 https://discord.com/developers/applications
 
 ### Invite bot your discord channel
 ```
 node index.js
 ```
 
## Technologies

 ### Music play
  Type commad Link or Song name
  find youtube and play
  ``` JS
const stream = ytdl(song.url, { filter: 'audioonly' });
const resource = createAudioResource(stream, { inlineVolume: true });
resource.volume.setVolume(.5);
audioPlayer.play(resource)
audioPlayer
.on(AudioPlayerStatus.Idle, () => {
     serverQueue.songs.shift();
     play(guild, serverQueue.songs[0], connection);
})
audioPlayer.on("error", error => console.error(error));
serverQueue.textChannel.send(`재생중인노래: **${song.title}**`);
```
  
 ### Music stop
  type stop command stop song play and disconnect
  ``` JS
serverQueue.songs = [];
serverQueue.connection.destroy();
queue.delete(message.guild.id);
  ```
  
 ### Music skip
  type skip command skip song and play next song
  ``` JS
serverQueue.songs.shift();
play(message.guild, serverQueue.songs[0], serverQueue.connection);
  ```
