const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES);
const client = new Client({ intents: myIntents });

let punishedUsers = [];
let leCoinTextChannelID;
let leCoinVoiceChannelID;

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	// console.log(client.channels.cache);
	const text_channel = client.channels.cache.find(element => element.name === 'le-coin' && element.type === 'GUILD_TEXT');
	const voice_channel = client.channels.cache.find(element => element.name === 'Le coin' && element.type === 'GUILD_VOICE');
	try {
		if (text_channel == undefined) {
			client.guilds.cache.first().channels.create('le-coin', { // TODO: Fix channel being created at server level
				type: 'GUILD_TEXT',
				// parent: ,
			}).then(chan => {leCoinTextChannelID = chan.id;});
		}
		else {
			leCoinTextChannelID = text_channel.id;
		}
		if (voice_channel == undefined) {
			client.guilds.cache.first().channels.create('Le coin', { // TODO: Fix channel being created at server level
				type: 'GUILD_VOICE',
				// parent: ,
			}).then(chan => {leCoinVoiceChannelID = chan.id;});
		}
		else {
			leCoinVoiceChannelID = voice_channel.id;
		}
	}
	catch (error) {
		console.log(error);
	}
});

client.on('voiceStateUpdate', (oldState, newState) => {
	if (newState.channelId != null) {
		// console.log(newState.channelId);
		console.log(punishedUsers);
		if (punishedUsers.indexOf(newState.member.user.username) !== -1 && newState.channel.name != 'Le coin') {
			newState.member.voice.setChannel(leCoinVoiceChannelID, 'You have not finished you punishment');
		}
	}
	// console.log(oldState);
	// console.log(newState.member.user.username);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		if (command.data.name == 'punish') {
			punishedUsers = await command.execute(interaction, client, punishedUsers, leCoinVoiceChannelID);
		}
		else if (command.data.name == 'sorry') {
			punishedUsers = await command.execute(interaction, client, punishedUsers, leCoinTextChannelID);
		}
		else {
			punishedUsers = await command.execute(interaction, client, punishedUsers);
		}
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);