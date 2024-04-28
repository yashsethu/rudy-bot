const { SlashCommandBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Google Gemini")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ask")
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
    if (subcommand === "ask") {
      const question = interaction.options.getString("prompt");
      const { totalTokens } = await model.countTokens(question);
      if (totalTokens > 30720) {
        await interaction.reply("Question is too long!");
        return;
      }
      const response = await model.generateContent(question);
      const answer = await response.response;
      const string = answer.text();
      await interaction.reply(string);
    }
  },
};
