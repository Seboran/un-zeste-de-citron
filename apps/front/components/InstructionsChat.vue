<template>
  <div class="rounded-lg bg-orange-50/30 p-4 space-y-4">
    <!-- Welcome Message -->
    <div v-if="step >= 1" class="prose prose-orange max-w-none">
      <TypeWriter 
        text="Hi! I'm Zeste. I'll help you generate a Vue.js form based on your requirements."
        :bold="true"
        @finished="step = 2"
      />
    </div>

    <!-- Schema Request -->
    <div v-if="step >= 2" class="prose prose-orange max-w-none">
      <TypeWriter 
        text="First, please provide your Zod schema that defines the form structure:"
        @finished="step = 4"
      />
    </div>

    <!-- Schema Input -->
    <div v-if="step >= 3" class="flex items-start space-x-3">
      <div class="flex-1">
        <CodeEditor
          v-model="schema"
          :rows="5"
          placeholder="// Exemple :
const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18)
});"
          class="mt-1"
          @update:modelValue="handleSchemaInput"
        />
      </div>
    </div>

    <!-- Instructions Request -->
    <div v-if="step >= 4" class="prose prose-orange max-w-none">
      <TypeWriter 
        text="And then, tell me if you have any specific instructions for the form:"
        @finished="step = 5"
      />
    </div>

    <!-- Instructions Input -->
    <div v-if="step >= 5" class="flex items-start space-x-3">
      <div class="flex-1">
        <textarea
          v-model="instructions"
          class="w-full rounded-lg border border-orange-200 focus:border-orange-400 focus:ring focus:ring-orange-200 bg-white shadow-sm resize-none text-sm p-3"
          rows="3"
          placeholder="Example: I want a registration form with email validation and a minimum age requirement..."
          @input="handleInstructionsInput"
        ></textarea>
      </div>
    </div>

    <!-- Generate Button -->
    <button
      v-if="step >= 6"
      @click="generateForm"
      :disabled="form.loading"
      class="w-full mt-4 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-lg transition-colors relative"
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

const step = ref(1)
const schema = ref('')
const instructions = ref('')
const form = useFormStore()

const handleSchemaInput = () => {
  if (schema.value.length > 0 && step.value === 3) {
    step.value = 4
  }
}

const handleInstructionsInput = () => {
  if (instructions.value.length > 0 && step.value === 5) {
    step.value = 6
  }
}

const generateForm = () => {
  form.generateForm({
    schema: schema.value,
    instructions: instructions.value,
  })
}
</script>