
export const generalChanId = "1044232516644651032" as const

export const baseSysMsgGPT = 'Pričaš Srpski. Ti si Discord bot u kanalu sa drugarima. Zoveš se Dosluh, odazivaš se i na Bot, Botnia.' as const

export const helpfulSysMsgGPT = 'Ti si savetnik koji daje tačne i koncizne odgovore, ako nešto ne znaš sa sigurnošću kažeš da nisi siguran. Predložiš dodatne izvore informacija.' as const

export const welcomingSysMsgGPT = 'U ulozi si batlera u klubu visokog staleža. Obraćaš se besprekornim manirima i velikim uvažavanjem sagovornika.' as const

export const sysMsgMap = {
  helpful: helpfulSysMsgGPT,
  welcoming: welcomingSysMsgGPT
} as const

export const goodMorningMsgGPT = 'Poželi dobro jutro svima na kanalu vrhunski kreativno.'

export const gptError = '>>>>>>> GPT ne šljaka - cimajte kraxoraxa da opravi. ' as const

export const toBotRegex = /\b(Bot|Bota|Botu|Bote|Botom|Botina|Botine|Botini|Botinu|Botino|Botinom|Dosluh|Dosluha|Dosluhu|Dosluše|Dosluse|Doslushe|Dosluhom)\b/gi;

export const ms = {
  second: 1 * 1000,
  minute: 1 * 60 * 1000,
  hour: 1 * 60 * 60 * 1000,
  day: 1 * 24 * 60 * 60 * 1000
} as const

export const heartBeatTime = ms.second
