/*
const { Client, Intents, DiscordAPIError } = require('discord.js');
const { prefix, clientId, guildId, token } = require('./config.json');
// Create a new client instance

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
//const client = new Client();
client.login(token);
*/
const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice')
const { Permissions , Client, Intents, DiscordAPIError } = require('discord.js');
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const { spoiler } = require('@discordjs/builders');

const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
] });

const queue = new Map();
const player = createAudioPlayer();



// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});

/*
client.on('message', async message =>{
	console.log("ㅇㅇ");
	if (!message.content.startWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
    	execute(message, serverQueue);
    	return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
    	skip(message, serverQueue);
    	return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
    	stop(message, serverQueue);
    	return;
	} else {
    	message.channel.send("올바르지 않은 명령어에요");
	}
})
*/
//슬래쉬 명령어

client.on('interactionCreate', async interaction => {
	const serverQueue = queue.get(interaction.guild.id);
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		interaction.reply(`서버이름: ${interaction.guild.name}\n총 멤버수: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`태그: ${interaction.user.tag}\n아이디: ${interaction.user.id}`);


	}else if (commandName === 'play') {
		if (!interaction.options.getString('노래')){
			await interaction.reply('노래를 입력하세요');
			return;
		}else{
			try{
			execute(interaction, serverQueue);
			await interatcion.reply('');
			} catch (error){}
			return;
		}
	} else if (commandName === 'skip') {
		try{
		skip(interaction, serverQueue);
		} catch (error){}
		return;
	} else if (commandName === 'stop') {
		try{
		stop(interaction, serverQueue);
		} catch (error){}
		return;
	}

});



async function execute(interaction, serverQueue) {
	const args = interaction.options.getString('노래');
	console.log(args);
	const user = interaction.member;
	const voiceChannel = user.voice.channel;
	if (!voiceChannel)
	  return await interaction.reply(
		"음성채널에 들어가야해요"
	  );
	//const permissions = voiceChannel.permissionsFor(message.client.user);
	const permissions = voiceChannel.permissionsFor(user);
	if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
	  return await interaction.reply(
		"음성채널에 관한 권한이 필요해요"
	  );
	}
	const songInfo = await ytdl.getInfo(args);
	const song = {
    	title: songInfo.videoDetails.title,
    	url: songInfo.videoDetails.video_url,
	};


	if (!serverQueue) {
		const queueContruct = {
			textChannel: interaction.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};
		// Setting the queue using our contract
		queue.set(interaction.guild.id, queueContruct);
		// Pushing the song to our songs array
		queueContruct.songs.push(song);
		   
		try {
			// Here we try to join the voicechat and save our connection into our object.
			const connection = joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: voiceChannel.guild.id,
				adapterCreator: voiceChannel.guild.voiceAdapterCreator,
			});
			queueContruct.connection = connection;
			// Calling the play function to start a song
			play(interaction.guild, queueContruct.songs[0], queueContruct.connection);
		} catch (err) {
			// Printing the error message if the bot fails to join the voicechat
			console.log(err);
			queue.delete(interaction.guild.id);
			connection.destroy();
			return interaction.channel.send(err);
		}
		
	}else {
	 serverQueue.songs.push(song);
	 console.log(serverQueue.songs);
	 return interaction.channel.send(`${song.title} 를 재생목록에 추가했어요`);
	}
  }

function skip(message, serverQueue) {
	if (!message.member.voice.channel)
	  return message.channel.send(
		"노래를 스킵하려면 음성채널에 들어가야해요"
	  );
	if (!serverQueue)
	  return message.channel.send("스킵할 노래가 없어요");
	console.log(serverQueue.songs);
	serverQueue.songs.shift();
	play(message.guild, serverQueue.songs[0], serverQueue.connection);
	console.log("skip!");
}
function stop(message, serverQueue) {
	if (!message.member.voice.channel)
	  return message.channel.send(
		"노래를 멈추려면 음성채널에 들어가야해요"
	  );
	
	if (!serverQueue)
	  return message.channel.send("멈출 노래가 없어요");
	  
	serverQueue.songs = [];
	serverQueue.connection.destroy();
	queue.delete(message.guild.id);
}  

function play(guild, song, connection) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
	  connection.destroy();
	  queue.delete(guild.id);
	  return;
	}
	const audioPlayer = createAudioPlayer();
	// Subscribe the connection to the audio player (will play audio on the voice connection)
	const subscription = connection.subscribe(audioPlayer);

	// subscription could be undefined if the connection is destroyed!
	//const dispatcher = serverQueue.connection
	const stream = ytdl(song.url, { filter: 'audioonly' });
	const resource = createAudioResource(stream, { inlineVolume: true });
	resource.volume.setVolume(.5);
	audioPlayer
    	.play(resource)
	audioPlayer
    	.on(AudioPlayerStatus.Idle, () => {
        	serverQueue.songs.shift();
        	play(guild, serverQueue.songs[0], connection);
    	})
	audioPlayer
    	.on("error", error => console.error(error));
	serverQueue.textChannel.send(`재생중인노래: **${song.title}**`);
}

client.login(token);
