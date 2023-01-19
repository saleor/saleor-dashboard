import { useCallback, useState } from "react"
import { useDebouncedEffect } from "../../hooks/useDebouncedEffect"
import { Textfield } from "../Textfield"

interface ISearchInputProps {
  className?: string
  onSearch: (query: string) => void
}

export const SearchInput = (props: ISearchInputProps) => {
  const [value, setValue] = useState("")
  const { onSearch, className } = props

  const runSearch = useCallback(() => {
    onSearch(value)
  }, [onSearch, value])
  useDebouncedEffect(runSearch, [])

  return (
    <Textfield
      onChange={(event) => setValue(event.target.value)}
      onBlur={runSearch}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          runSearch()
        }
      }}
      placeholder="Search full request"
      className={className}
      testId="search-input"
      type="search"
      autoFocus
    />
  )
}
