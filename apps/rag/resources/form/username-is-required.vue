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
    <button type="submit">
      Submit
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { z } from "zod";

export const usernameSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

const formData = ref({ username: "" });
const errors = ref({});

const validateField = (field) => {
  try {
    usernameSchema.shape[field].parse(formData.value[field]);
    errors.value[field] = null;
  } catch (e) {
    errors.value[field] = e.errors[0]?.message;
  }
};

const validateForm = () => {
  try {
    usernameSchema.parse(formData.value);
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
    alert("Form submitted successfully!");
  }
};
</script>