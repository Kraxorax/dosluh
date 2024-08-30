import dotenv from 'dotenv'
import OpenAI from 'openai'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { heartBeat, onMessageCreate } from './fun'
import { heartBeatTime } from './const'

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

export const heartBeatInterval = setInterval(heartBeat, heartBeatTime)

console.log('Is running!')