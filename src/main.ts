import dotenv from 'dotenv'
import OpenAI from 'openai'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { onMessageCreate } from './fun'

dotenv.config()

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
})

export const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

client.on('messageCreate', onMessageCreate)

client.login(process.env.DOSLUH_TOKEN)
  .then(res => console.log('Discord login successful'))
  .catch(err => console.error('FAILED Discord login', err))

console.log('Is running!')