import { Message } from "discord.js";
import { baseSysMsgGPT, gptError, helpfulSysMsgGPT, msgMem, toBotRegex } from "./data";
import { openAI } from "./main";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";

export const isBotTalk = (s: string) => {
  const regX = new RegExp(toBotRegex)
  return regX.test(s)
}

export const isLastMessage = (m: Message) => {
  return msgMem[msgMem.length - 1]?.id === m.id
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

    const data = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: baseSysMsgGPT + helpfulSysMsgGPT },
        { role: "user", content: msg }
      ],
    } as ChatCompletionCreateParamsNonStreaming

    openAI.chat.completions.create(data)
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
  } else {
    console.log('not talking to bot - ignoring')
  }
}



