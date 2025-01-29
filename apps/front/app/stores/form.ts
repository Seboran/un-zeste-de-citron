import { generateVuejsForm } from '@zeste/chat-api'
import { defineStore } from 'pinia'
import { API_GENERATE_CODE, API_GENERATE_TEST } from '../utils/EndpointConstants'

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

  const { generateForm: callApi } = generateVuejsForm({ api: API_GENERATE_CODE })

  const { decodeStream } = useDecodeStream(toRef(state, 'vueCode'))

  async function generateForm({ schema, instructions }: GenerateFormParams) {
    state.loading = true
    state.error = null

    try {
      await decodeStream(await callApi({ schema, instructions }))
    } catch (error) {
      console.error('Error while fetching Mistral AI response:', error)
      state.vueCode =
        "Mon chatbot a un peu du mal 💀. N'hésitez pas à naviguer via le menu en haut !"
    } finally {
      state.loading = false
      state.generated = true
    }
  }

  const { generateForm: callTestApi } = generateVuejsForm({ api: API_GENERATE_TEST })
  const { decodeStream: decodeStreamTest } = useDecodeStream(toRef(state, 'tests'))

  async function generateTestForm({ schema }: { schema: string }) {
    console.log('yo')
    try {
      await decodeStreamTest(await callTestApi({ schema, instructions: state.vueCode }))
    } catch (error) {
      console.error('Error while fetching Mistral AI response:', error)
      state.tests = "Mon chatbot a un peu du mal 💀. N'hésitez pas à naviguer via le menu en haut !"
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
    generateTestForm,
    reset,
    vueCode: computed(() => state.vueCode),
    error: computed(() => state.error),
    loading: computed(() => state.error),
    generated: computed(() => state.generated),
    zodConfig: '',
    tests: computed(() => state.tests),
  }
})
