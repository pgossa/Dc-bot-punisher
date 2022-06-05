const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require('../config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');


const resource = createAudioResource(('/home/hipk/projects/Dc-bot-punisher/resources/pas-net.mp3'), {
	inlineVolume : true,
});
resource.volume.setVolume(0.9);

const player = createAudioPlayer();

const coinChannelId = '983067220747886652';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punish')
		.setDescription('Punish a sinner!')
		.addUserOption(option =>
			option.setName('sinner')
				.setDescription('Name of the sinner!')
				.setRequired(true)),
	async execute(interaction, client) {
		const user = interaction.options.getMember('sinner');
		const guild = client.guilds.cache.get(guildId);
		const member = await guild.members.fetch(user);
		const channel = client.channels.cache.get(coinChannelId);
		member.voice.setChannel(channel, 'You are being punished');

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		connection.subscribe(player);
		player.play(resource);

		setTimeout(function() {
			console.log('playing');
		}, 50000);
		await interaction.reply(user.user.username);
	},
};