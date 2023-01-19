import hljs from "highlight.js"
import { useEffect, useState } from "react"

type Language = "json" | "graphql"

export interface MessagePayload {
  language: Language
  code: string
}

/**
 * Highlight the text in a worker thread and return the resulting markup.
 * This provides a performant async way to render the given text.
 *
 * @param language the language to highlight against
 * @param code the code to highlight
 * @returns
 */
export const useHighlight = (language: Language, code: string) => {
  const [loading, setLoading] = useState(false)
  const [markup, setMarkup] = useState("")

  useEffect(() => {
    // Highlight small code blocks in the main thread
    if (code.length < 500) {
      const result = hljs.highlight(code, { language })
      setMarkup(result.value)
      setLoading(false)
      return
    }

    // Highlight large code blocks in a worker thread
    const worker = new Worker(new URL("./worker.ts", import.meta.url))
    worker.onmessage = (event) => {
      setLoading(false)
      setMarkup(event.data)
    }
    setLoading(true)
    const messagePayload: MessagePayload = { language, code }
    worker.postMessage(messagePayload)

    return () => {
      worker.terminate()
    }
  }, [setLoading, setMarkup, language, code])

  return { markup, loading }
}
