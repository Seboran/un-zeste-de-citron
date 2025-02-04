<script setup lang="ts">
import { marked } from 'marked'
import Prism from 'prismjs'
import { onMounted, ref } from 'vue'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { ClientOnly } from '#components'

const props = defineProps<{
  content: string
}>()

const parsedContent = ref('')

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

watchEffect(async () => {
  // Configure marked with custom renderer
  marked.setOptions({
    // @ts-expect-error on verra
    langPrefix: 'language-',
  })

  // Create custom renderer
  const renderer = {
    code(code: string, language: string | undefined) {
      console.log(code)
      const highlighted =
        language && Prism.languages[language]
          ? Prism.highlight(code, Prism.languages[language], language)
          : code

      const escapedCode = code.replace(/`/g, '\\`').replace(/\$/g, '\\$')
      return `
        <div class="code-block">
          <button class="copy-button" onclick="this.closest('.markdown-content').dispatchEvent(new CustomEvent('copy-code', { detail: \`${escapedCode}\` }))">
            Copy
          </button>
          <pre><code class="language-${language}">${highlighted}</code></pre>
        </div>
      `
    },
  }

  // Use the custom renderer
  // marked.use({ renderer })

  // Parse markdown content
  parsedContent.value = await marked.parse(props.content)
})
</script>

<template>
  <ClientOnly>
    <div 
      class="markdown-content" 
      v-html="parsedContent"
      @copy-code="(e: any) => copyCode(e.detail)"
    ></div>
  </ClientOnly>
</template>

<style scoped>
.markdown-content {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  padding: 1rem;
}

.markdown-content :deep(.code-block) {
  position: relative;
  margin: 1rem 0;
}

.markdown-content :deep(.copy-button) {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #666;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.markdown-content :deep(.code-block:hover .copy-button) {
  opacity: 1;
}

.markdown-content :deep(pre) {
  padding: 1rem;
  border-radius: 4px;
  background-color: #f5f5f5;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}
</style>