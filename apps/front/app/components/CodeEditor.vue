<template>
  <div class="relative font-mono">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      class="w-full h-full bg-transparent text-transparent caret-orange-800 resize-none rounded-lg border border-orange-200 focus:border-orange-400 focus:ring focus:ring-orange-200 bg-white shadow-sm"
      :rows="rows"
      :placeholder="placeholder"
    ></textarea>
    <pre
      aria-hidden="true"
      class="absolute top-0 left-0 pointer-events-none w-full h-full overflow-hidden bg-white rounded-lg p-[9px] text-sm"
    ><code class="hljs typescript" v-html="highlightedCode"></code></pre>
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import { computed } from 'vue'

hljs.registerLanguage('typescript', typescript)

const props = defineProps<{
  modelValue: string
  rows?: number
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const highlightedCode = computed(() => {
  if (!props.modelValue) return props.placeholder || ''
  return hljs.highlight(props.modelValue, { language: 'typescript' }).value
})
</script>

<style scoped>
textarea {
  font-family: inherit;
  line-height: inherit;
  padding: 0.5rem;
}

pre {
  font-family: inherit;
  line-height: inherit;
  margin: 0;
}

pre code {
  font-family: inherit;
}
</style>