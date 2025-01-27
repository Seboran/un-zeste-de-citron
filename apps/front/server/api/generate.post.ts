import { useChatFunction } from '../useChatFunction'

export default defineEventHandler(async (event) => {
  const { mistralAgentId, mistralApiEndpoint, mistralApiKey } = useRuntimeConfig(event)

  const { post } = useChatFunction({
    apiKey: mistralApiKey,
    MISTRAL_AGENT_ID: mistralAgentId,
    MISTRAL_API_ENDPOINT: mistralApiEndpoint,
  })

  try {
    return sendStream(event, await post(toWebRequest(event)))
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Invalid request',
    })
  }
})
