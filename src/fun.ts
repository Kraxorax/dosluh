import { Message } from "discord.js";
import { actionMem, msgMem, rateLimits } from "./data";
import { baseSysMsgGPT, generalChanId, goodMorningMsgGPT, gptError, heartBeatTime, sysMsgMap, toBotRegex } from './const'
import { client, openAI } from "./main";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";

export const isBotTalk = (s: string) => {
  const regX = new RegExp(toBotRegex)
  return regX.test(s)
}

export const isLastMessage = (m: Message) => {
  return msgMem[msgMem.length - 1]?.id === m.id
}

const is7amInBelgradeSerbia = () => {
  const now = new Date()
  const belgrade = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Belgrade' }))
  return belgrade.getHours() === 7
}

const makeGptQuery = (msg: string, sysMsg: string, temp: number = 0.7): ChatCompletionCreateParamsNonStreaming => ({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: baseSysMsgGPT + sysMsg },
    { role: "user", content: msg }
  ],
  temperature: temp
})

const updateTimers = (msg: Message) => {
  if (rateLimits.min.startTime === 0) {
    rateLimits.min.startTime = Date.now()

    rateLimits.min.timeout = setTimeout(() => {
      if (rateLimits.min.requestCount === rateLimits.min.requestLimit) {
        msg.channel.send('Eo dozvah se pameti, molim te ponovi pitanje.')
      }
      rateLimits.min.startTime = 0
      rateLimits.min.requestCount = 0
    }, rateLimits.min.boundaryTime)

    rateLimits.min.requestCount = 1

    return false
  } else if (rateLimits.min.startTime > 0 && rateLimits.min.requestCount < rateLimits.min.requestLimit) {
    rateLimits.min.requestCount += 1
    return false
  } else if (rateLimits.min.startTime > 0 && rateLimits.min.requestCount === rateLimits.min.requestLimit) {
    return 'Ščekaj loma, udaren minutni limit.'
  }

  if (rateLimits.day.startTime === 0) {
    rateLimits.day.startTime = Date.now()

    rateLimits.day.timeout = setTimeout(() => {
      if (rateLimits.day.requestCount === rateLimits.day.requestLimit) {
        msg.channel.send('Joj evo budan. Šta je bilo? Šta ste hteli?')
      }
      rateLimits.day.startTime = 0
      rateLimits.day.requestCount = 0
    }, rateLimits.day.boundaryTime)

    rateLimits.day.requestCount = 1

    return false
  } else if (rateLimits.day.startTime > 0 && rateLimits.day.requestCount < rateLimits.day.requestLimit) {
    rateLimits.day.requestCount += 1
    return false
  } else if (rateLimits.day.startTime > 0 && rateLimits.day.requestCount === rateLimits.day.requestLimit) {
    return 'Otišo sam da spavam. Javim kad se izbudim.'
  }

  return 'Wat-D-Fak? ovo ne treba da se desi'
}

const doGoodMorning = () => {
  if (is7amInBelgradeSerbia() && !actionMem.morningWelcomed) {
    const query = makeGptQuery(goodMorningMsgGPT, sysMsgMap.welcoming, 1)
    openAI.chat.completions.create(query)
      .then(completion => {
        const morningMessage = completion.choices[0]?.message.content || gptError
        client.channels.fetch(generalChanId)
          .then(chan => {
            chan?.isTextBased() ? chan.send(morningMessage) : void 0
          })
      })

    actionMem.morningWelcomed = true
  }
  if (!is7amInBelgradeSerbia() && actionMem.morningWelcomed) {
    actionMem.morningWelcomed = false
  }
}

export const heartBeat = () => {
  if (rateLimits.min.requestCount >= rateLimits.min.requestLimit
    || (rateLimits.day.requestCount / rateLimits.day.requestLimit) >= ((Date.now() - rateLimits.day.startTime) / rateLimits.day.boundaryTime)
  ) {
    console.log('~^-~^- heart beat skipped due to limits', rateLimits)
    return
  }

  doGoodMorning()
}


export const onMessageCreate = async (message: Message) => {
  console.log(`Message from ${message.author.displayName} : ${message.content}`)

  if (msgMem.push(message) > 1000) {
    msgMem.shift()
  }

  if (message.author.bot) {
    console.log('is bot - ignoring')
    return
  }

  const msg = message.content

  if (isBotTalk(msg)) {
    console.log('Replying to question', msg)

    const query = makeGptQuery(msg, sysMsgMap.helpful)

    const limitMsg = updateTimers(message)

    if (limitMsg) {
      message.channel.send(limitMsg)
    } else {
      openAI.chat.completions.create(query)
        .then(completion => {
          const answer = completion.choices[0]?.message.content || gptError
          if (isLastMessage(message)) {
            message.channel.send(answer)
          } else {
            message.reply(answer)
          }
        }).catch(rej => {
          console.log('FAIL openIA chat completion', rej)
        })
    }
  } else {
    console.log('not talking to bot - ignoring')
  }
}



