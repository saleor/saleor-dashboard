import PrettierGraphQLParsers from "prettier/parser-graphql"
import prettier from "prettier/standalone"
import { useMemo } from "react"

export function useFormattedCode(
  code: string,
  language: string,
  enabled = true
) {
  return useMemo(() => {
    if (enabled) {
      if (language === "graphql") {
        try {
          return prettier.format(code, {
            parser: language,
            useTabs: false,
            tabWidth: 2,
            plugins: [PrettierGraphQLParsers],
          })
        } catch (e) {
          console.error(e)
        }
      }
    }

    return code
  }, [code, language, enabled])
}
