<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="username">Username</label>
      <input
        id="username"
        v-model="formData.username"
        type="text"
        @blur="validateField('username')"
      />
      <p v-if="errors.username">{{ errors.username }}</p>
    </div>
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
      <label for="age">Age</label>
      <input
        id="age"
        v-model="formData.age"
        type="number"
        @blur="validateField('age')"
      />
      <p v-if="errors.age">{{ errors.age }}</p>
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { z } from 'zod'

const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'You must be at least 18 years old'),
})

const formData = ref({ username: '', email: '', age: '' })
const errors = ref({})

const validateField = (field) => {
  try {
    userSchema.shape[field].parse(formData.value[field])
    errors.value[field] = null
  } catch (e) {
    errors.value[field] = e.errors[0]?.message
  }
}

const validateForm = () => {
  try {
    userSchema.parse(formData.value)
    errors.value = {}
    return true
  } catch (e) {
    errors.value = e.errors.reduce((acc, err) => {
      acc[err.path[0]] = err.message
      return acc
    }, {})
    return false
  }
}

const handleSubmit = () => {
  if (validateForm()) {
    alert('Form submitted successfully!')
  }
}
</script>