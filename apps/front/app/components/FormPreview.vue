<template>
  <div class="space-y-6">
    <h2 class="text-lg font-medium text-orange-900">Form Preview</h2>
    
    <div v-if="!form.generated" class="text-center text-orange-600/80 py-12 border border-orange-200 rounded-lg bg-orange-50/50">
      Generate a form to see the live preview here.
    </div>
    
    <div v-else class="border border-orange-200 rounded-lg">
      <div class="p-4 border-b border-orange-100 bg-orange-50/50">
        <h3 class="text-sm font-medium text-orange-900">Live Preview</h3>
      </div>
      <div class="p-6">
        <!-- <component :is="previewComponent" class="preview-sandbox" /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw } from 'vue'
import { useFormStore } from '~/stores/form'

const form = useFormStore()

const previewComponent = computed(() => {
  if (!form.vueCode) return null

  try {
    // Create a new component definition from the code
    const component = {
      template: form.vueCode,
      setup() {
        return {}
      },
    }

    // Return a markRaw wrapped component to avoid Vue warning
    return markRaw(defineAsyncComponent(() => Promise.resolve(component)))
  } catch (error) {
    console.error('Error creating preview component:', error)
    return null
  }
})
</script>

<style scoped>
.preview-sandbox {
  @apply bg-white rounded-lg;
}

.preview-sandbox :deep(input),
.preview-sandbox :deep(select),
.preview-sandbox :deep(textarea) {
  @apply w-full rounded-lg border border-orange-200 focus:border-orange-400 focus:ring focus:ring-orange-200 bg-white shadow-sm p-2 mb-4;
}

.preview-sandbox :deep(label) {
  @apply block text-sm font-medium text-orange-900 mb-1;
}

.preview-sandbox :deep(button) {
  @apply w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors;
}
</style>