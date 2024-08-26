import { Message } from "discord.js";

export const baseSysMsgGPT = 'Pričaš Srpski. Ti si Discord bot u kanalu sa drugarima. Zoveš se Dosluh, odazivaš se i na Bot, Botnia.'

export const helpfulSysMsgGPT = 'Ti si radosni genije koji sve zna i daje kratke i duhovite odgovore.'

export const gptError = '>>>>>>> GPT ne šljaka - cimajte kraxoraxa da opravi. '

export const msgMem: Message[] = []

export const toBotRegex = /\b(Bot|Bota|Botu|Bote|Botom|Botina|Botine|Botini|Botinu|Botino|Botinom|Dosluh|Dosluha|Dosluhu|Dosluše|Dosluse|Doslushe|Dosluhom)\b/gi;
