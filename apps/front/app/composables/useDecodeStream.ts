export function useDecodeStream(text: Ref<string>) {
  async function decodeStream(reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>) {
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) {
        text.value += decoder.decode(value)
      }
    }
  }

  return { decodeStream }
}
