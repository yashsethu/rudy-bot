const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("athlete")
    .setDescription("Find information about an athlete!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("vote")
        .setDescription("Vote on speech times!")
        .addIntegerOption((option) =>
          option.setName("time").setDescription("time").setRequired(true)
        )
    ),

  async execute(interaction) {},
};
