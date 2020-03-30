const express = require('express')
const Discord = require('discord.js')

const PORT = process.env.PORT || 3000
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

// discord bot config
const bot = new Discord.Client()
bot.login(DISCORD_TOKEN)

const userContent = {}

bot.on('ready', () => {
  console.log(`discord login: ${bot.user.tag}!`);
})
bot.on('message', msg => {
  const { author: { username }, content } = msg
  console.log('discord new msg:', username, content)

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