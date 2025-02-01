export function useGenerateForm(schema: Ref<string>, instructions: Ref<string>) {
  const formStore = useFormStore()

  async function generateForm() {
    formStore.reset()

    await formStore.generateForm({
      schema: schema.value,
      instructions: instructions.value,
    })
    await formStore.generateTest()
  }

  return {
    generateForm,
    form: formStore,
  }
}
