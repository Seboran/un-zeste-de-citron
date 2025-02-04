<script setup lang="ts">
const formStore = useFormStore()
</script>

<template>
  <GeneratedForm :content="`\`\`\`vue\n${formStore.vueCode}\n\`\`\``" />
  <GeneratedForm :content="formStore.tests" />
</template>