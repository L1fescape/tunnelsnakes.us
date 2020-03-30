const express = require('express')
const Discord = require('discord.js')

const PORT = process.env.PORT || 3000
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

// discord bot config
const bot = new Discord.Client()
bot.login(DISCORD_TOKEN)

const userContent = {}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
})
bot.on('message', msg => {
  console.log(msg)
  const { author: { username } } = msg
  if (username === 'Overseer') {
    return
  }
  userContent[username] = msg.content
})

// express server config
const app = express()
app.get("/:username", function(req, res) {
  const username = req.params.username
  const content = userContent[username]
  if (content) {
    return res.send(content)
  }
  res.send("tunnel snakes rule")
})

app.listen(PORT, function() {
  console.log(`running on ${PORT}`)
})