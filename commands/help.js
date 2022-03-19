const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Say a help message'),

	async execute(interaction) {

	}
};
