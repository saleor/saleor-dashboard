import React, { useState } from "react"
import RegexParser from "regex-parser"

import { SplitPaneLayout } from "../../components/Layout"
import { NetworkRequest } from "../../hooks/useNetworkMonitor"
import { Toolbar } from "../Toolbar"
import { NetworkDetails } from "./NetworkDetails"
import { NetworkTable } from "./NetworkTable"

interface NetworkPanelProps {
  selectedRowId: string | number | null
  setSelectedRowId: (selectedRowId: string | number | null) => void
  networkRequests: NetworkRequest[]
  clearWebRequests: () => void
}

const getRegex = (str: string) => {
  try {
    const regex = RegexParser(str)
    return { regex, errorMessage: null }
  } catch (error) {
    let message = "Invalid Regex"
    if (error instanceof Error) {message = error.message}
    return { regex: null, errorMessage: message }
  }
}

const filterNetworkRequests = (
  networkRequests: NetworkRequest[],
  filterValue: string,
  options: {
    isInverted: boolean
    isRegex: boolean
  }
): { results: NetworkRequest[]; errorMessage?: string } => {
  if (!filterValue?.trim()?.length) {
    return { results: networkRequests }
  }

  const regexResult = options.isRegex ? getRegex(filterValue) : null
  if (regexResult?.errorMessage) {
    return { results: [], errorMessage: regexResult.errorMessage }
  }

  const results = networkRequests.filter((networkRequest) => {
    const { operationName = "" } = networkRequest.request.primaryOperation
    const isMatch = options.isRegex
      ? operationName.match(regexResult?.regex as RegExp)
      : operationName.toLowerCase().includes(filterValue.toLowerCase())

    return options.isInverted ? !isMatch : isMatch
  })

  return { results }
}

export const NetworkPanel = (props: NetworkPanelProps) => {
  const { networkRequests, clearWebRequests, selectedRowId, setSelectedRowId } =
    props

  const [filterValue, setFilterValue] = useState("")
  const [isInverted, setIsInverted] = useState(false)
  const [isRegexActive, onIsRegexActiveChange] = useState(false)

  const { results: filterResults, errorMessage: filterError } =
    filterNetworkRequests(networkRequests, filterValue, {
      isInverted,
      isRegex: isRegexActive,
    })

  const selectedRequest = networkRequests.find(
    (request) => request.id === selectedRowId
  )

  return (
    <SplitPaneLayout
      header={
        <Toolbar
          filterValue={filterValue}
          onFilterValueChange={setFilterValue}
          inverted={isInverted}
          onInvertedChange={setIsInverted}
          regexActive={isRegexActive}
          onRegexActiveChange={onIsRegexActiveChange}
          onClear={() => {
            setSelectedRowId(null)
            clearWebRequests()
          }}
        />
      }
      leftPane={
        <NetworkTable
          data={filterResults}
          error={filterError}
          selectedRowId={selectedRowId}
          onRowClick={setSelectedRowId}
          onRowSelect={setSelectedRowId}
          showSingleColumn={Boolean(selectedRequest)}
        />
      }
      rightPane={
        selectedRequest && (
          <div
            className="dark:bg-gray-900 border-l border-gray-300 dark:border-gray-600 h-full"
            style={{ minWidth: 200 }}
          >
            <NetworkDetails
              data={selectedRequest}
              onClose={() => {
                setSelectedRowId(null)
              }}
            />
          </div>
        )
      }
    />
  )
}
