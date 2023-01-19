import { useEffect, useState } from "react"
import { chromeProvider } from "../services/chromeProvider"

export const useOperatingSystem = () => {
  const [os, setOs] = useState<string>("")

  useEffect(() => {
    const chrome = chromeProvider()
    chrome.runtime.getPlatformInfo((info) => {
      setOs(info.os)
    })
  }, [setOs])

  return os
}
