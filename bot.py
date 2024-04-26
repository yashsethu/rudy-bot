from discord import Intents
from discord.ext import commands

# Sets up the pycord intents
intents = Intents.default()
intents.typing = False
intents.presences = False
bot = commands.Bot(command_prefix="!", intents=intents)


class Speech(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.votes = {}

    @bot.slash_command(name="speech", description="Commands related to the speech")
    async def speech(self, ctx, subcommand: str, time: int):
        if subcommand == "vote":
            if time is None:
                await ctx.respond("Please set a time.")
            elif not isinstance(time, int) or not 0 <= time <= 60:
                await ctx.respond(
                    "Invalid vote. Please vote for a time between 0 and 60 minutes."
                )
            else:
                user_id = str(ctx.author.id)  # Convert the user ID to a string
                if user_id in self.votes:  # Check if the user has already voted
                    await ctx.respond("You have already voted.")
                else:
                    self.votes[user_id] = (
                        time  # Store the vote with the user ID as a string
                    )
                    print(self.votes)  # Print out the votes dictionary
                    await ctx.respond(f"You voted for {time} minutes.")
        elif subcommand == "set":
            if time is None:
                await ctx.respond("Please set a time.")
            elif not isinstance(time, int) or not 0 <= time <= 60:
                await ctx.respond(
                    "Invalid time. Please set a time between 0 and 60 minutes."
                )
            else:
                if not self.votes:  # Check if votes is not empty
                    await ctx.respond("No votes have been cast yet.")
                    await ctx.respond(
                        f"The speech time has been set to {time} minutes."
                    )
                    return
                closest = min(
                    self.votes.keys(), key=lambda k: abs(self.votes[k] - time)
                )
                await ctx.respond(f"The speech time has been set to {time} minutes.")
                await ctx.respond(
                    f"The actual time is {time} minutes. The closest vote was {self.votes[closest]} minutes by <@{closest}>."
                )
        else:
            await ctx.respond("Invalid subcommand.")


bot.add_cog(Speech(bot))

bot.run("MTIzMjUxMjQ2MTAyNzAxNjczNQ.GQQJRh.OFixnxYaV65xvFgUVtUVqYsjHK985ooxdgHdys")
