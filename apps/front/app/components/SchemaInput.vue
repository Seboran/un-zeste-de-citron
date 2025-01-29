<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-orange-900 mb-2">Zod Schema</label>
      <CodeEditor
        v-model="schema"
        :rows="5"
        placeholder="const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18)
});"
        class="mt-1"
      />
    </div>
    <div>
      <InstructionsChat
        v-model="instructions"
        class="mt-1"
      />
    </div>
    <button
      @click="generateForm"
      :disabled="form.loading"
      class="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-lg transition-colors relative"
    >
      <span :class="{ 'opacity-0': form.loading }">
        Generate Form
      </span>
      <div v-if="form.loading" class="absolute inset-0 flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </button>
    <div v-if="form.error" class="text-red-500 text-sm mt-2">
      {{ form.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFormStore } from '~/stores/form'

const schema = ref(`const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18)
});`)
const instructions = ref('')
const form = useFormStore()

const generateForm = async () => {
  await form.generateForm({
    schema: schema.value,
    instructions: instructions.value,
  })
}
</script>