const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpunish')
		.setDescription('Forgive a sinner')
		.addUserOption(option =>
			option.setName('sinner')
				.setDescription('Name of the sinner!')
				.setRequired(true)),
	async execute(interaction, client, punishedUsers) {
		const user = interaction.options.getMember('sinner');
		const indexOfUser = punishedUsers.indexOf(user.user.username);
		if (indexOfUser != -1) {
			delete punishedUsers[indexOfUser];
		}
		await interaction.reply(user.user.username + ' has been forgiven');
		return punishedUsers;
	},
};