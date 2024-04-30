const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("athlete")
    .setDescription("Find information about an athlete!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("time")
        .setDescription("Race Times!")
        .addStringOption((option) =>
          option.setName("time").setDescription("time").setRequired(true)
        )
    ),

  async execute(interaction) {},
};
