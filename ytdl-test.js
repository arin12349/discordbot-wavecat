const { StreamType } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const stream = ytdl('https://www.youtube.com/watch?v=7RBeeT-4NG0', { filter: 'audioonly' });
/*
const songInfo = ytdl.getInfo('https://www.youtube.com/watch?v=7RBeeT-4NG0');
const song = {
    title: songInfo.title,
    url: songInfo.video_url,
};
console.log(song);
console.log(songInfo);
stream.destroy();
*/
stream.on('progress', (d, total, length) => {
    console.log('progress', total / length);
});
