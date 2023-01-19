import hljs from "highlight.js"
import { MessagePayload } from "./"

onmessage = (event) => {
  const { language, code } = event.data as MessagePayload
  const result = hljs.highlight(code, { language })
  postMessage(result.value)
}
