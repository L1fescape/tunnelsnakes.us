import * as express from 'express'
import * as Discord from 'discord.js'
import * as redis from 'redis'

const PORT = process.env.PORT || 3000
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

if (!DISCORD_TOKEN) {
  console.error('env var DISCORD_TOKEN not defined.')
  process.exit(1)
}

// database
const db = redis.createClient({ url: process.env.REDIS_URL })
db.on('connect', () => console.log('Connected to Redis'))
const USERKEY = 'users'

// discord bot config
const bot = new Discord.Client()
bot.login(DISCORD_TOKEN)

bot.on('ready', () => {
  if (!bot.user) {
    return console.error('no discord user object')
  }
  console.log('discord bot login:', bot.user.tag)
})
bot.on('message', msg => {
  const { author: { id, username }, content } = msg
  if (msg.channel.type !== 'dm') {
    return
  }
  console.log('setting new msg:', `${username}:${id}`, content)
  db.hset(USERKEY, username, content)
})

// express server config
const app = express()
app.get("/:username", (req, res) => {
  const { params: { username } } = req
  db.hget(USERKEY, username, (err, content) => {
    if (err) {
      console.error(err)
      return res.send('err')
    }
    if (!content) {
      return res.send('not found<br /><br />← <a href="/">back</a>')
    }
    return res.send(content)
  })
})

app.get("*", (_, res) => {
  db.hgetall(USERKEY, (err, users) => {
    let content = '🐍'
    if (err) {
      console.error(err)
      return res.send('err')
    }
    const usernames = Object.keys(users || {})
    if (usernames.length) {
      content += ` users:<br />${usernames.map(user => `<li><a href="/${user}">${user}</a></li>`).join('')}`
    }
    return res.send(content)
  })
})

app.listen(PORT, function() {
  console.log(`express port: ${PORT}`)
})