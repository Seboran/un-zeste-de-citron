```ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "You must be at least 18"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```
```vue
<template>
  <form @submit.prevent="handleSubmit" >
    <!-- Name Field -->
    <div>
      <label for="name" >Full Name</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        @blur="validateField('name')"
      />
      <p v-if="errors.name">{{ errors.name }}</p>
    </div>

    <!-- Email Field -->
    <div>
      <label for="email" >Email Address</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        @blur="validateField('email')"
      />
      <p v-if="errors.email">{{ errors.email }}</p>
    </div>

    <!-- Age Field -->
    <div>
      <label for="age" >Age</label>
      <input
        id="age"
        v-model="formData.age"
        type="number"
        @blur="validateField('age')"
      />
      <p v-if="errors.age">{{ errors.age }}</p>
    </div>

    <!-- Password Field -->
    <div>
      <label for="password" >Password</label>
      <input
        id="password"
        v-model="formData.password"
        type="password"
        @blur="validateField('password')"
      />
      <p v-if="errors.password">{{ errors.password }}</p>
    </div>

    <!-- Submit Button -->
    <button type="submit">
      Register
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { z } from "zod";

// Define the validation schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.preprocess((val) => Number(val), z.number().min(18, "You must be at least 18")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Reactive form state
const formData = ref({ name: "", email: "", age: "", password: "" });
const errors = ref({});

// Validate individual field
const validateField = (field) => {
  try {
    registerSchema.shape[field].parse(formData.value[field]);
    errors.value[field] = null;
  } catch (e) {
    errors.value[field] = e.errors[0]?.message;
  }
};

// Validate the entire form
const validateForm = () => {
  try {
    registerSchema.parse(formData.value);
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

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    alert("Registration successful!");
  }
};
</script>
```