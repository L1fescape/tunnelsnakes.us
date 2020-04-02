import * as Discord from 'discord.js'

export interface BotConfig {
  onSetUserContent: (username: string, content: string) => void
}

export interface TunnelSnakesBot {
  (config: BotConfig): Discord.Client
}

export const Bot: TunnelSnakesBot = ({ onSetUserContent }) => {
  const bot = new Discord.Client()

  bot.on('ready', () => {
    if (!bot.user) {
      console.error('no discord user object')
      return
    }
    console.log('discord bot login:', bot.user.tag)
  })

  bot.on('message', msg => {
    const { author, channel, content } = msg
    if (channel.type === 'dm') {
      console.log('setting new msg:', `${author.username}:${author.id}`, content)
      onSetUserContent(author.username, content)
    }
  })

  return bot
}