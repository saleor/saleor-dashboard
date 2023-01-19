import React, { useState } from "react"
import { v4 as uuid } from "uuid"

import { createRequest } from "../helpers/createRequest";
import { getPrimaryOperation, parseGraphqlRequest } from "../helpers/graphqlHelpers";
import { useSearch } from "../hooks/useSearch";
import { SplitPaneLayout } from "./Layout";
import { NetworkPanel } from "./NetworkPanel";

export const DevToolsPanel = () => {
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(
    null
  )
  const [networkRequests] = useState(() => {
    const saved = localStorage.getItem("requests");
    const r = JSON.parse(saved);

    const result = r.map((query: string) => createRequest({
      request: [{
        query,
        variables: {}
      }],
      response: {
        data: {
          getMovie: {
            id: "1",
            title: "Batman",
            genre: "Action",
          },
        },
      },
    })).map((details) => {
      const primaryOperation = getPrimaryOperation(
        details.request.postData?.text
      )
      const graphqlRequestBody = parseGraphqlRequest(
        details.request.postData?.text
      )
      return {
        id: uuid(),
        status: details.response.status,
        url: details.request.url,
        time: details.time === -1 || !details.time ? 0 : details.time,
        request: {
          primaryOperation,
          headers: details.request.headers,
          body: graphqlRequestBody,
          headersSize: details.request.headersSize,
          bodySize: details.request.bodySize,
        },
        response: {
          headers: details.response.headers,
          headersSize: details.response.headersSize,
          bodySize:
            details.response.bodySize === -1
              ? details.response._transferSize || 0
              : details.response.bodySize,
        }
      }
    })

    return result; 
  });

  const { isSearchOpen } = useSearch()

  return (
    <>
      <SplitPaneLayout
        leftPane={
          isSearchOpen ? (
            <></>
          ) : undefined
        }
        rightPane={
          <NetworkPanel
            networkRequests={networkRequests}
            clearWebRequests={() => null}
            selectedRowId={selectedRowId}
            setSelectedRowId={setSelectedRowId}
          />
        }
      />
    </>
  )
}
