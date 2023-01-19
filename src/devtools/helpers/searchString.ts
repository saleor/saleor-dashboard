interface ISearchStringArgs {
  text: string
  search: string
  buffer?: number
}

export const searchString = ({
  text,
  search,
  buffer = 12,
}: ISearchStringArgs) => {
  const searchRegex = new RegExp(search, "i")
  const matchPosition = text.search(searchRegex)
  const highlightLength = search.length
  const matchPositionEnd = matchPosition + highlightLength

  const start = text.slice(Math.max(0, matchPosition - buffer), matchPosition)
  const match = text.slice(matchPosition, matchPositionEnd)
  const end = text.slice(matchPositionEnd, matchPositionEnd + buffer)

  return {
    start,
    match,
    end,
  }
}
