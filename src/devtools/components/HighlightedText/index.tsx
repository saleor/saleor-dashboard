import { useMemo } from "react"

import { searchString } from "../../helpers/searchString"

interface IHighlightedTextProps {
  text: string
  highlight: string
  buffer?: number
}

export const HighlightedText = (props: IHighlightedTextProps) => {
  const { text, highlight, buffer } = props
  const { start, match, end } = useMemo(
    () => searchString({ text, search: highlight, buffer }),
    [text, highlight, buffer]
  )

  return (
    <>
      {start}
      <span className="dark:bg-blue-600 bg-blue-200 font-bold">{match}</span>
      {end}
    </>
  )
}
