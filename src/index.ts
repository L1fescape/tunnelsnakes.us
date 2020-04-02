import { Bot } from './bot'
import { DB } from './db'
import { Server } from './server'

const {
  PORT = '3000',
  DISCORD_TOKEN,
  REDIS_URL,
} = process.env

if (!DISCORD_TOKEN) {
  console.error('env var DISCORD_TOKEN not defined.')
  process.exit(1)
}

if (!REDIS_URL) {
  console.error('env var REDIS_URL not defined.')
  process.exit(1)
}

// init database connection
const db = DB(REDIS_URL)

// init discord bot
const bot = Bot({
  onSetUserContent: db.setUserContent,
})

// init server
export const server = Server({
  port: PORT,
  onReady: () => bot.login(DISCORD_TOKEN),
  onGetAllUsers: db.getAllUsers,
  onGetUserContent: db.getUserContent,
})