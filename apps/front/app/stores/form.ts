import { defineStore } from 'pinia'
import type { GenerateRequestBody, GenerateResponseBody } from '~~/server/api/generate.post'
import type { TestRequestBody, TestResponseBody } from '~~/server/api/test.post'

interface GenerateFormParams {
  schema: string
  instructions: string
}

export const useFormStore = defineStore('form', () => {
  const state = reactive({
    generated: false,
    vueCode: `<template>
  <form @submit.prevent="handleSubmit" >
    <div>
      <label for="email">Email</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        @blur="validateField('email')"
      />
      <p v-if="errors.email">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password">Password</label>
      <input
        id="password"
        v-model="formData.password"
        type="password"
        @blur="validateField('password')"
      />
      <p v-if="errors.password">{{ errors.password }}</p>
    </div>

    <button type="submit">
      Login
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const formData = ref({ email: "", password: "" });
const errors = ref({});

const validateField = (field) => {
  try {
    loginSchema.shape[field].parse(formData.value[field]);
    errors.value[field] = null;
  } catch (e) {
    errors.value[field] = e.errors[0]?.message;
  }
};

const validateForm = () => {
  try {
    loginSchema.parse(formData.value);
    errors.value = {};
    return true;
  } catch (e) {
    errors.value = e.errors.reduce((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
    return false;
  }
};

const handleSubmit = () => {
  if (validateForm()) {
    alert("Login successful!");
  }
};
</script>
`,
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
  async function generateTest() {
    state.loading = true
    state.error = null

    const body: TestRequestBody = {
      form: state.vueCode,
    }
    try {
      const response = await $fetch<TestResponseBody>('/api/test', {
        method: 'POST',
        body,
      })
      state.tests = response.answer
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
    generateTest,
    reset,
    vueCode: computed(() => state.vueCode),
    error: computed(() => state.error),
    loading: computed(() => state.error),
    generated: computed(() => state.generated),
    zodConfig: '',
    tests: computed(() => state.tests),
  }
})
