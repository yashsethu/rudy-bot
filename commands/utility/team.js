const { SlashCommandBuilder } = require("discord.js");
const { meetNumbers } = require("./meet");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("team")
    .setDescription("Find information about a team!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("id")
        .setDescription("Team ID!")
        .addIntegerOption((option) =>
          option.setName("ID").setDescription("ID").setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "id":
        const id = interaction.options.getInteger("ID");
        const team = await axios.get(`https://api.athletic.net/v2/teams/${id}`);
        await interaction.reply({
          content: `Team name: ${team.data.name}\nTeam ID: ${team.data.id}\nSchool: ${team.data.school.name}`,
        });
        break;
    }
  },
};
