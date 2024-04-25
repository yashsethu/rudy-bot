from discord import Intents
from discord.ext import commands, tasks
from datetime import datetime, timedelta
import asyncio

# Sets up the pycord intents
intents = Intents.default()
intents.typing = False
intents.presences = False
bot = commands.Bot(command_prefix="!", intents=intents)

# Dictionary to store the votes
votes = {}


class Speech(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.slash_command(name="speech", description="Commands related to the speech")
    async def speech(self, ctx, subcommand: str, time: int):
        if subcommand == "vote":
            if 0 <= time <= 60:
                votes[ctx.author.id] = time
                await ctx.respond(f"You voted for {time} minutes.")
            else:
                await ctx.respond(
                    "Invalid vote. Please vote for a time between 0 and 60 minutes."
                )
        elif subcommand == "set":
            if 0 <= time <= 60:
                closest = min(votes.keys(), key=lambda k: abs(votes[k] - time))
                await ctx.respond(
                    f"The actual time is {time} minutes. The closest vote was {votes[closest]} minutes by <@{closest}>."
                )
            else:
                await ctx.respond(
                    "Invalid time. Please set a time between 0 and 60 minutes."
                )


bot.add_cog(Speech(bot))


@tasks.loop(hours=24)
async def reset_votes():
    votes.clear()


@reset_votes.before_loop
async def before_reset_votes():
    await bot.wait_until_ready()
    now = datetime.now()
    future = datetime(now.year, now.month, now.day, 12, 0)
    if now.hour >= 12:  # If it's past 12:00, start the loop tomorrow
        future += timedelta(days=1)
    await asyncio.sleep((future - now).seconds)


reset_votes.start()

bot.run("MTIzMjUxMjQ2MTAyNzAxNjczNQ.GQQJRh.OFixnxYaV65xvFgUVtUVqYsjHK985ooxdgHdys")
