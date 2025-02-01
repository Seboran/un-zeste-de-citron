export type GenerateRequestBody = {
  schema: string
}

export type GenerateResponseBody = {
  answer: string
}

/**
 * Returns a `GenerateRequestBody` obje
 */
export default defineEventHandler<{ body: GenerateRequestBody }>(
  async (event): Promise<GenerateResponseBody> => {
    const { ragEndpoint } = useRuntimeConfig(event)

    try {
      const body = await readBody(event)
      return await $fetch(ragEndpoint + '/api/generate', {
        method: 'POST',
        body: {
          schema: body.schema,
        },
      })
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : 'Invalid request',
      })
    }
  },
)
