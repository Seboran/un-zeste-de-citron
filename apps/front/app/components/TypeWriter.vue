<template>
  <p
    ref="textContainer"
    class="text-sm text-orange-900"
    :class="{ 'font-medium': bold }"
  >{{ displayedText }}</p>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  text: string
  bold?: boolean
  delay?: number
}>()

const emit = defineEmits<{
  finished: []
}>()

const displayedText = ref('')
const textContainer = ref<HTMLElement | null>(null)

const typeText = async () => {
  displayedText.value = ''
  const chars = props.text.split('')

  for (const char of chars) {
    await new Promise((resolve) => setTimeout(resolve, props.delay || 3))
    displayedText.value += char
  }
  emit('finished')
}

onMounted(() => {
  typeText()
})

watch(
  () => props.text,
  () => {
    typeText()
  },
)
</script>