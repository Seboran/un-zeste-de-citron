import { defineStore } from 'pinia'
import { z } from 'zod'

interface GenerateFormParams {
  schema: string
  instructions: string
}

export const useFormStore = defineStore('form', () => {
  const state = reactive({
    generated: false,
    vueCode: '',
    zodConfig: '',
    tests: '',
    loading: false,
    error: null,
  })

  async function generateForm({ schema, instructions }: GenerateFormParams) {
    state.loading = true
    state.error = null

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema, instructions }),
      })

      if (!response.body) {
        console.error('No response body from the SSE endpoint')
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          state.vueCode += decoder.decode(value)
        }
      }
    } catch (error) {
      console.error('Error while fetching Mistral AI response:', error)
      state.vueCode =
        "Mon chatbot a un peu du mal 💀. N'hésitez pas à naviguer via le menu en haut !"
    } finally {
      state.loading = false
      state.generated = true
    }
  }

  return {
    generateForm,
    vueCode: computed(() => state.vueCode),
    error: computed(() => state.error),
    loading: computed(() => state.error),
    generated: computed(() => state.generated),
    zodConfig: '',
    tests: '',
  }
})
