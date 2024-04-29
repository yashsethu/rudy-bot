const { SlashCommandBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

module.exports = {
  votes: {},
  lastTimeSet: null,
  data: new SlashCommandBuilder()
    .setName("coach")
    .setDescription("What do you want to do?")
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ask")
        .setDescription("Ask Coach Rudy (Gemini) a question!")
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription("What do you want?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("generate")
        .setDescription("Ask Google Gemini a question!")
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription("What to ask Gemini")
            .setRequired(true)
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
          const now = Date.now();
          if (
            this.lastTimeSet &&
            now - this.lastTimeSet < 24 * 60 * 60 * 1000
          ) {
            await interaction.reply("The time can only be set once a day!");
          } else {
            this.lastTimeSet = now;
          }
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
      case "generate":
      case "ask":
        await interaction.deferReply();
        let question = interaction.options.getString("prompt");
        if (interaction.options.getSubcommand() === "ask") {
          question =
            "Answer this question, pretending like I'm a track athlete and you are my old, slightly snarky, track coach that has dedicated his entire life and career to track: " +
            question;
        }
        const { totalTokens } = await model.countTokens(question);
        try {
          if (totalTokens > 30720) {
            await interaction.editReply("Question is too long!");
            return;
          }
          const response = await model.generateContent(question);
          const answer = await response.response;
          const string = answer.text();
          if (string.length > 2000) {
            const truncatedString = string.substring(0, 2000 - 3) + "...";
            await interaction.editReply(truncatedString);
          } else {
            await interaction.editReply(string);
          }
        } catch (error) {
          if (error.message.includes("SAFETY")) {
            await interaction.editReply(
              "This prompt was blocked due to safety"
            );
          } else {
            await interaction.editReply(
              "An error occurred while executing the command."
            );
          }
        }
        break;
    }
  },
};
