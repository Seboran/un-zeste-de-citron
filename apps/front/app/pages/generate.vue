<template>
  <div class="min-h-screen bg-orange-50 p-6">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-4xl font-bold text-orange-600 mb-4">Zeste</h1>
      <p class="text-orange-800/80 mb-8">Generate Vue.js forms from Zod schemas and natural language instructions.</p>

      <div class="grid grid-cols-[500px_auto] gap-4">
        <!-- Left Column (Fixed Width) -->
        <div class="w-[500px] space-y-8">
          <div class="bg-white rounded-sm shadow-sm p-6">
            <InstructionsChat />
          </div>
          <div class="bg-white rounded-sm shadow-sm p-6">
            <FormPreview />
          </div>
        </div>

        <!-- Right Column (Auto Width) -->
        <div class="flex-1 overflow-hidden bg-white rounded-sm shadow-sm p-6">
          <GeneratedForm />
        </div>
      </div>

    </div>
  </div>
</template>