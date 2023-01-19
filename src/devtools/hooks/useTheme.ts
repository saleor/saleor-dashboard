import { useEffect } from "react"

export const useDarkTheme = () => {
  const isDark = true
  // const isDark = false

  // Switch out the css for highlight.js depending on the theme
  useEffect(() => {
    const darkThemeLink = document.getElementById("highlightjs-dark-theme")
    const lightThemeLink = document.getElementById("highlightjs-light-theme")

    if (isDark) {
      // eslint-disable-next-line chai-friendly/no-unused-expressions
      lightThemeLink?.setAttribute("disabled", "disabled")
      // eslint-disable-next-line chai-friendly/no-unused-expressions
      darkThemeLink?.removeAttribute("disabled")
    } else {
      // eslint-disable-next-line chai-friendly/no-unused-expressions
      darkThemeLink?.setAttribute("disabled", "disabled")
      // eslint-disable-next-line chai-friendly/no-unused-expressions
      lightThemeLink?.removeAttribute("disabled")
    }
  }, [isDark])

  return isDark
}
