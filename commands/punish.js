const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');


const resource = createAudioResource(('/home/hipk/projects/Dc-bot-punisher/resources/pas-net.mp3'), {
	inlineVolume : true,
});
resource.volume.setVolume(0.9);

const player = createAudioPlayer();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punish')
		.setDescription('Punish a sinner!')
		.addUserOption(option =>
			option.setName('sinner')
				.setDescription('Name of the sinner!')
				.setRequired(true)),
	async execute(interaction, client, punishedUsers, leCoinVoiceChannelID) {
		const user = interaction.options.getMember('sinner');
		punishedUsers.push(user.user.username);
		const channel = client.channels.cache.get(leCoinVoiceChannelID);
		user.voice.setChannel(channel, 'You are being punished');

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		connection.subscribe(player);
		player.play(resource);
		await interaction.reply(user.user.username + ' is being punished');
		return punishedUsers;
	},
};