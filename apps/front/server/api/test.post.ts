import { useChatFunction } from '../useChatFunction'

export default defineEventHandler(async (event) => {
  const { mistralApiEndpoint, mistralTestAgentId, mistralApiKey } = useRuntimeConfig(event)

  const { post } = useChatFunction({
    apiKey: mistralApiKey,
    MISTRAL_AGENT_ID: mistralTestAgentId,
    MISTRAL_API_ENDPOINT: mistralApiEndpoint,
  })

  try {
    return await post(toWebRequest(event))
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Invalid request',
    })
  }
})
