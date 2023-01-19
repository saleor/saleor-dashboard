import { useEffect, useRef } from "react"
import Mark from "mark.js"
import { useSearch } from "./useSearch"

/**
 * Mark given text.
 * @param content Optional content to listen for changes to causing mark to re-run.
 *
 * @returns ref to the element to mark
 */
export const useMark = (searchQuery: string, content?: string) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const mark = new Mark(ref.current)
    mark.mark(searchQuery, {
      caseSensitive: false,
      separateWordSearch: false,
    })

    return () => {
      mark.unmark()
    }
  }, [ref, searchQuery, content])

  return ref
}

/**
 * Mark text that has been searched from the search provider.
 * @param content Optional content to listen for changes to causing mark to re-run.
 *
 * @returns ref to the element to mark
 */
export const useMarkSearch = (content?: string) => {
  const { searchQuery } = useSearch()
  const ref = useMark(searchQuery, content)

  return ref
}
