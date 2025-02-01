export type TestRequestBody = {
  form: string
}

export type TestResponseBody = {
  answer: string
}

/**
 * Returns a `TestRequestBody` obje
 */
export default defineEventHandler<{ body: TestRequestBody }>(
  async (event): Promise<TestResponseBody> => {
    const { ragEndpoint } = useRuntimeConfig(event)

    try {
      const body = await readBody(event)
      return await $fetch(ragEndpoint + '/api/test', {
        method: 'POST',
        body,
      })
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: error instanceof Error ? error.message : 'Invalid request',
      })
    }
  },
)
