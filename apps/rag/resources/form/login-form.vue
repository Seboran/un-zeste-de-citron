<template>
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
```