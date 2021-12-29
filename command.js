const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder()
		.setName('play')
		.setDescription('노래를 시작하기')
		.addStringOption(option => option.setName('노래').setDescription('듣고싶은 노래를 입력하세요')),

	new SlashCommandBuilder().setName('skip').setDescription('노래를 스킵하기'),
	new SlashCommandBuilder().setName('stop').setDescription('노래를 멈추기'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);