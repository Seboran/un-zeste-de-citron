<template>
  <div>
    <h2>Form Preview</h2>
    <component :is="dynamicComponent" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watch } from 'vue';

const props = defineProps<{
  formCode: string
}>()

const dynamicComponent = shallowRef(null)

// Watch for changes in formCode and dynamically create a component
watch(
  () => props.formCode,
  async (newCode) => {
    if (newCode) {
      const componentOptions = new Function(`return ${newCode}`)() // Converts string to a Vue component
      dynamicComponent.value = defineAsyncComponent(() => Promise.resolve(componentOptions))
    }
  },
  { immediate: true },
)
</script>
