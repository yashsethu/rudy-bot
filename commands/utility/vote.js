const { SlashCommandBuilder } = require("discord.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  votes: {},
  data: new SlashCommandBuilder()
    .setName("speech")
    .setDescription("Speech commands!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("vote")
        .setDescription("Vote on speech times!")
        .addIntegerOption((option) =>
          option.setName("time").setDescription("time").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set actual (or estimated) speech times for the day!")
        .addIntegerOption((option) =>
          option.setName("time").setDescription("time").setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const time = interaction.options.getInteger("time");
    const user = `<@${interaction.user.id}>`;

    if (!subcommand) {
      await interaction.reply({
        content: "You must provide a subcommand!",
        ephemeral: true,
      });
      return;
    }

    switch (subcommand) {
      case "vote":
        if (this.votes[user]) {
          await interaction.reply("You've already voted!");
        } else {
          this.votes[user] = time; // Store the vote
          await interaction.reply(`${user} voted for ${time} minutes!`);
        }
        break;
      case "set":
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
          await interaction.reply("Only admins can set the time!");
        } else {
          if (Object.keys(this.votes).length === 0) {
            await interaction.reply(
              `${user} set the speech time as ${time} minutes, but no votes have been cast yet!`
            );
          } else {
            let closestUser = null;
            let closestTimeDifference = Infinity;

            for (const [voter, vote] of Object.entries(this.votes)) {
              const timeDifference = Math.abs(vote - time);

              if (timeDifference < closestTimeDifference) {
                closestUser = `${voter}`;
                closestTimeDifference = timeDifference;
              }
            }

            await interaction.reply(
              `${user} set the speech time as ${time} minutes! The closest vote was ${closestUser} with ${this.votes[closestUser]} minutes.`
            );

            this.votes = {};
          }
        }
        break;
    }
  },
};
