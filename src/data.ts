import { Message } from "discord.js";
import { ms } from "./const";

export const msgMem: Message[] = []

export const rateLimits = {
  min: {
    startTime: 0,
    boundaryTime: ms.minute,
    requestCount: 0,
    requestLimit: 3 as const,
    timeout: undefined as undefined | Timer,
  },
  day: {
    startTime: 0,
    boundaryTime: ms.day,
    requestCount: 0,
    requestLimit: 200 as const,
    timeout: undefined as undefined | Timer,
  }
}

export const actionMem = {
  morningWelcomed: false,
}