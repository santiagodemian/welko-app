import OpenAI from 'openai'

declare global {
  // eslint-disable-next-line no-var
  var __openai: OpenAI | undefined
}

function makeClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('[Polaris] OPENAI_API_KEY is not set. Add it to .env.local')
  return new OpenAI({ apiKey })
}

export const openai: OpenAI =
  globalThis.__openai ??
  (() => {
    const client = makeClient()
    if (process.env.NODE_ENV !== 'production') globalThis.__openai = client
    return client
  })()
