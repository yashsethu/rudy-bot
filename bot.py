# Imports
from discord import Intents
from discord.ext import commands

# Sets up the pycord intents
intents = Intents.default()
intents.typing = False
intents.presences = False
bot = commands.Bot(command_prefix="!", intents=intents)

votes = {}

speech_time = 0

speech = bot.create_group("speech", "Commands related to the speech")


@speech.command()
async def vote(ctx, time: int):
    if not isinstance(time, int) or not 0 <= time <= 60:
        await ctx.respond(
            "Invalid vote. Please vote for a time between 0 and 60 minutes."
        )
        return
    else:
        user_id = str(ctx.author.id)  # Convert the user ID to a string
        if user_id in votes:  # Check if the user has already voted
            await ctx.respond("You have already voted.")
            return
        else:
            votes[user_id] = time  # Store the vote with the user ID as a string
            await ctx.respond(f"You voted for {time} minutes.")
            return


@speech.command()
async def set(ctx, time: int):
    if not ctx.author.guild_permissions.administrator:
        await ctx.respond("Sorry, you are not an admin.")
        return
    elif not isinstance(time, int) or not 0 <= time <= 60:
        await ctx.respond("Invalid time. Please set a time between 0 and 60 minutes.")
        return
    else:
        if not votes:  # Check if votes is not empty
            await ctx.respond("No votes have been cast yet.")
        closest = min(votes.keys(), key=lambda k: abs(votes[k] - time))
        await ctx.respond(f"The speech time has been set to {time} minutes.")
        await ctx.respond(
            f"The actual time is {time} minutes. The closest vote was {votes[closest]} minutes by <@{closest}>."
        )
        votes.clear()


bot.run("MTIzMjUxMjQ2MTAyNzAxNjczNQ.GQQJRh.OFixnxYaV65xvFgUVtUVqYsjHK985ooxdgHdys")
