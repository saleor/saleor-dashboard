import React, { useMemo } from "react"

import { useSearch } from '../../hooks/useSearch';
import { CloseButton } from "../CloseButton"
import { Header } from "../Header"
import { SearchInput } from "../SearchInput"
import { SearchResults } from "./SearchResults"


interface ISearchPanelProps {
  networkRequests: NetworkRequest[]
  onResultClick: (
    searchResult: ISearchResult,
    searchResultType: NetworkTabs
  ) => void
}

export const SearchPanel = (props: ISearchPanelProps) => {
  const { networkRequests, onResultClick } = props
  const { searchQuery, setSearchQuery, setIsSearchOpen } = useSearch()
  const searchResults = useMemo(
    () => getSearchResults(searchQuery, networkRequests),
    [searchQuery, networkRequests]
  )

  return (
    <div
      className="flex flex-col h-full border-r border-gray-300 dark:border-gray-600"
      data-testid="search-panel"
    >
      <Header
        rightContent={
          <CloseButton
            onClick={() => setIsSearchOpen(false)}
            className="mr-2"
          />
        }
      >
        <div className="flex items-center pl-2" style={{ height: "3.5rem" }}>
          <h2 className="font-bold">Search</h2>
        </div>
      </Header>
      <div className="p-2">
        <SearchInput className="w-full" onSearch={setSearchQuery} />
      </div>
      {searchResults && (
        <div className="scroll overflow-y-scroll">
          <SearchResults
            searchQuery={searchQuery}
            searchResults={searchResults}
            onResultClick={onResultClick}
          />
        </div>
      )}
    </div>
  )
}
