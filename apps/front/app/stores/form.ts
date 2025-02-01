import { defineStore } from 'pinia'
import type { GenerateRequestBody, GenerateResponseBody } from '~~/server/api/generate.post'

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

  async function generateForm({ schema, instructions: _instructions }: GenerateFormParams) {
    state.loading = true
    state.error = null

    const body: GenerateRequestBody = {
      schema,
    }
    try {
      const response = await $fetch<GenerateResponseBody>('/api/generate', {
        method: 'POST',
        body,
      })
      state.vueCode = response.answer
    } catch (error) {
      console.error('Error while fetching Mistral AI response:', error)
      state.vueCode =
        "Mon chatbot a un peu du mal 💀. N'hésitez pas à naviguer via le menu en haut !"
    } finally {
      state.loading = false
      state.generated = true
    }
  }

  function reset() {
    state.vueCode = ''
    state.tests = ''
  }

  return {
    generateForm,
    reset,
    vueCode: computed(() => state.vueCode),
    error: computed(() => state.error),
    loading: computed(() => state.error),
    generated: computed(() => state.generated),
    zodConfig: '',
    tests: computed(() => state.tests),
  }
})
