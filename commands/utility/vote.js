const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote for speech times!'),
	async execute(interaction) {
		await interaction.reply('Test vote command!');
	},
};