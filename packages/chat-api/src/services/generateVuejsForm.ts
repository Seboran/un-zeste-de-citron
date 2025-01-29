interface GenerateFormParams {
  schema: string
  instructions: string
}

export function generateVuejsForm({
  api,
}: {
  api: string
}) {
  async function generateForm({ schema, instructions }: GenerateFormParams) {
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema, instructions }),
      })

      if (!response.body) {
        console.error('No response body from the SSE endpoint')
        throw new Error('No response body from the SSE endpoint')
      }

      return response.body.getReader()
    } catch (error) {
      console.error('Error while fetching Mistral AI response:', error)
      throw error
    } finally {
      //
    }
  }
  return {
    generateForm,
  }
}
