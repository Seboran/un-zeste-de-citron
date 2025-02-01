```ts
const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18)
});
```
```vue
<template>
  <form @submit.prevent="submit">
    <input v-model="user.username" type="text" placeholder="Username" />
    <input v-model="user.email" type="email" placeholder="Email" />
    <input v-model="user.age" type="number" placeholder="Age" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18),
});

const user = ref({
  username: '',
  email: '',
  age: null,
});

const submit = () => {
  try {
    user.value = userSchema.parse(user.value);
    // Now you can submit the user data
  } catch (error) {
    console.error('Validation error:', error.issues);
  }
};
</script>
```