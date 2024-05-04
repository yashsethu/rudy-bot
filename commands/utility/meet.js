const { SlashCommandBuilder } = require("discord.js");
let meetNumbers = {};

module.exports = {
  meetNumbers,
  data: new SlashCommandBuilder()
    .setName("meet")
    .setDescription("Meet commands!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set the meet number!")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the meet!")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("number")
            .setDescription("Meet number from athletic.net!")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "set":
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
          await interaction.reply({
            content: "You must be an administrator to use this command!",
            ephemeral: true,
          });
          return;
        }
        const name = interaction.options.getString("name");
        const number = interaction.options.getString("number");
        meetNumbers[name] = number;
        await interaction.reply({
          content: `Meet number for ${name} set to ${number}!`,
        });
        break;
    }
  },
};
