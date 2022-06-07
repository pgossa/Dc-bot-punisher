const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sorry')
		.setDescription('I decide to repent')
		.addStringOption(option =>
			option.setName('sentence')
				.setDescription('Sentence of redemption')
				.setRequired(true)),
	async execute(interaction, client, punishedUsers) {
		const sentence = interaction.options.getString('sentence');
		if (sentence == 'Sorry') {
			const indexOfUser = punishedUsers.indexOf(interaction.user.username);
			if (indexOfUser != -1) {
				delete punishedUsers[indexOfUser];
			}
			await interaction.reply('You have been forgiven');
		}
		else {
			await interaction.reply('This is not the redemption sentence !');
		}
		return punishedUsers;
	},
};