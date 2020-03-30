const express = require('express')
const Discord = require('discord.js')
const redis = require('redis')

const PORT = process.env.PORT || 3000
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

// database
const db = redis.createClient(process.env.REDIS_URL)
db.on('connect', () => console.log('Connected to Redis'))
const USERKEY = 'users'

// discord bot config
const bot = new Discord.Client()
bot.login(DISCORD_TOKEN)

let botId = null
bot.on('ready', () => {
  botId = bot.user.id
  console.log('discord bot login:', bot.user.tag)
})
bot.on('message', msg => {
  const { author: { id, username }, content } = msg
  console.log('discord new msg:', `${username}:${id}`, content)
  // ignore msgs from bot
  if (id === botId) {
    return
  }
  db.hset(USERKEY, username, content)
})

// express server config
const app = express()
app.get("/:username", function(req, res) {
  const { params: { username } } = req
  db.hget(USERKEY, username, function(err, content) {
    if (err) {
      console.error(err)
      return res.send('err')
    }
    if (!content) {
      res.send('not found<br /><br />← <a href="/">back</a>')
      return
    }
    res.send(content)
  })
})

app.get("*", function(req, res) {
  db.hgetall(USERKEY, (err, users) => {
    let content = '🐍'
    if (err) {
      console.error(err)
      return res.send('err')
    }
    const usernames = Object.keys(users || {})
    if (usernames.length) {
      content += ` users:<br />${usernames.map(user => `<li><a href="/${user}">${user}</a></li>`)}`
    }
    res.send(content)
  })
})

app.listen(PORT, function() {
  console.log(`express port: ${PORT}`)
})