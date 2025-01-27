<template>
  <div class="min-h-screen bg-orange-50 p-6">
    <div class="max-w-[1600px] mx-auto">
      <div class="text-center space-y-6 py-24">
        <h1 class="text-6xl font-bold text-orange-600">Zeste</h1>
        <p class="text-xl text-orange-800/80 max-w-2xl mx-auto">
          Generate beautiful Vue.js forms from Zod schemas and natural language instructions, powered by AI.
        </p>
        <div class="pt-6">
          <NuxtLink
            to="/generate"
            class="inline-block py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            Start Generating Forms
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>