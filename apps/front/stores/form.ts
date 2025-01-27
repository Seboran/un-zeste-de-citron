import { defineStore } from 'pinia'
import { z } from 'zod'

interface FormState {
  generated: boolean
  vueCode: string
  zodConfig: string
  tests: string
  loading: boolean
  error: string | null
}

interface GenerateFormParams {
  schema: string
  instructions: string
}

export const useFormStore = defineStore('form', {
  state: (): FormState => ({
    generated: false,
    vueCode: '',
    zodConfig: '',
    tests: '',
    loading: false,
    error: null,
  }),

  actions: {
    async generateForm({ schema, instructions }: GenerateFormParams) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/generate', {
          method: 'POST',
          body: {
            schema,
            instructions,
          },
        })

        this.vueCode = response.vueCode
        this.zodConfig = response.zodConfig
        this.tests = response.tests
        this.generated = true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to generate form'
        console.error('Error generating form:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
