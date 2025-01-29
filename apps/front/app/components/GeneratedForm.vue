<template>
  <div class="space-y-6">
    <h2 class="text-lg font-medium text-orange-900">Generated Form</h2>
    
    <div v-if="form.loading" class="text-center py-12 border border-orange-200 rounded-lg bg-orange-50/50">
      <svg class="animate-spin h-8 w-8 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-orange-600/80">Generating your form...</p>
    </div>
    
    <div>
      <div class="space-y-6">
        <div class="border border-orange-200 rounded-lg shadow-sm">
          <div class="p-4 border-b border-orange-100 bg-orange-50/50">
            <h3 class="text-sm font-medium text-orange-900">Vue Form Component</h3>
          </div>
          <div class="p-4 bg-white">
            <pre class="text-sm overflow-x-auto font-mono"><code>{{ form.vueCode }}</code></pre>
          </div>
        </div>

        <div class="border border-orange-200 rounded-lg shadow-sm">
          <div class="p-4 border-b border-orange-100 bg-orange-50/50">
            <h3 class="text-sm font-medium text-orange-900">Unit Tests</h3>
          </div>
          <div class="p-4 bg-white">
            <pre class="text-sm overflow-x-auto font-mono"><code>{{ form.tests }}</code></pre>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores/form'

const form = useFormStore()
</script>