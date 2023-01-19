import { useEffect, useState } from "react"
import copy from "copy-to-clipboard"

const useCopy = () => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [copied])

  return {
    isCopied: copied,
    copy: (text: string) => {
      setCopied(true)
      copy(text)
    },
  }
}

export default useCopy
