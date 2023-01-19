import { useEffect } from "react"

export const useSearchStart = (cb: () => void) => {
  useEffect(() => {
    // Attaching event to body allows stopPropagation
    // to block inbuilt search bar from appearing
    const body = document.querySelector("body")
    if (!body) {
      return
    }

    const getIsCommandKeyPressed = (event: KeyboardEvent) => {
      return event.code === "MetaLeft" || event.code === "ControlLeft"
    }

    let isCommandKeyPressed = false
    const handleKeyDown = (event: KeyboardEvent) => {
      if (getIsCommandKeyPressed(event)) {
        isCommandKeyPressed = true
      } else if (event.code === "KeyF" && isCommandKeyPressed) {
        event.preventDefault()
        event.stopPropagation()
        cb()
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      if (getIsCommandKeyPressed(event)) {
        isCommandKeyPressed = false
      }
    }
    body.addEventListener("keydown", handleKeyDown)
    body.addEventListener("keyup", handleKeyUp)

    return () => {
      body.removeEventListener("keydown", handleKeyDown)
      body.removeEventListener("keyup", handleKeyUp)
    }
  }, [cb])
}
