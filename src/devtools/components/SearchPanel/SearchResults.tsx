import { FC } from "react"
import { HighlightedText } from "../../components/HighlightedText"
import { ISearchResult } from "../../services/searchService"
import {
  getHeaderSearchContent,
  getRequestSearchContent,
  getResponseSearchContent,
} from "../../helpers/getSearchContent"
import { NetworkTabs } from "../../hooks/useNetworkTabs"

interface ISearchResultsProps {
  searchQuery: string
  searchResults: ISearchResult[]
  onResultClick: (
    searchResult: ISearchResult,
    searchResultType: NetworkTabs
  ) => void
}

interface ISearchResultEntryProps {
  searchQuery: string
  searchResult: ISearchResult
  onResultClick: (searchResultType: NetworkTabs) => void
  index: number
}

interface ISearchResultEntryRowProps {
  title: string
  onClick: () => void
}

const SearchResultEntryRow: FC<ISearchResultEntryRowProps> = ({
  title,
  children,
  onClick,
}) => {
  return (
    <div
      className="flex dark:hover:bg-gray-700 hover:bg-gray-300 cursor-pointer -ml-2 -mr-2 px-2"
      onClick={onClick}
    >
      <div className="mr-3 opacity-70">{title}</div>
      <div className="whitespace-nowrap">{children}</div>
    </div>
  )
}

const SearchResultEntry = (props: ISearchResultEntryProps) => {
  const { searchQuery, searchResult, onResultClick, index } = props
  const { matches, networkRequest } = searchResult
  const { operationName } = networkRequest.request.primaryOperation

  return (
    <div data-testid={`search-results-${index}`}>
      <div className="font-bold mb-1">{operationName}</div>
      {matches.headers && (
        <SearchResultEntryRow
          title="Header"
          onClick={() => onResultClick(NetworkTabs.HEADER)}
        >
          <HighlightedText
            text={getHeaderSearchContent(networkRequest)}
            highlight={searchQuery}
          />
        </SearchResultEntryRow>
      )}
      {matches.request && (
        <SearchResultEntryRow
          title="Request"
          onClick={() => onResultClick(NetworkTabs.REQUEST)}
        >
          <HighlightedText
            text={getRequestSearchContent(networkRequest)}
            highlight={searchQuery}
          />
        </SearchResultEntryRow>
      )}
      {matches.response && (
        <SearchResultEntryRow
          title="Response"
          onClick={() => onResultClick(NetworkTabs.RESPONSE_RAW)}
        >
          <HighlightedText
            text={getResponseSearchContent(networkRequest)}
            highlight={searchQuery}
          />
        </SearchResultEntryRow>
      )}
    </div>
  )
}

export const SearchResults = (props: ISearchResultsProps) => {
  const { searchQuery, searchResults, onResultClick } = props
  return (
    <div className="pt-0 p-2 space-y-2">
      {searchResults.map((searchResult, index) => (
        <SearchResultEntry
          key={searchResult.networkRequest.id}
          index={index}
          searchQuery={searchQuery}
          searchResult={searchResult}
          onResultClick={(searchResultType) => {
            onResultClick(searchResult, searchResultType)
          }}
        />
      ))}
    </div>
  )
}
