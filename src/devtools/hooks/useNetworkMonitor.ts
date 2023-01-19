import { useCallback, useEffect, useState } from "react"
import { v4 as uuid } from "uuid"
import {
  getPrimaryOperation,
  parseGraphqlRequest,
  OperationDetails,
} from "../helpers/graphqlHelpers"
import { onRequestFinished, getHAR } from "../services/networkMonitor"

export type Header = { name: string; value?: string }
export type NetworkRequest = {
  id: string
  status: number
  url: string
  time: number
  request: {
    primaryOperation: OperationDetails
    headers: Header[]
    body: {
      query: string
      variables?: object
    }[]
    headersSize: number
    bodySize: number
  }
  response?: {
    headers?: Header[]
    body?: string
    headersSize: number
    bodySize: number
  }
}

export const useNetworkMonitor = (): [NetworkRequest[], () => void] => {
  const [webRequests, setWebRequests] = useState<NetworkRequest[]>([])

  const handleRequestFinished = useCallback(
    (details: chrome.devtools.network.Request) => {
      const primaryOperation = getPrimaryOperation(
        details.request.postData?.text
      )
      if (!primaryOperation) {
        return
      }

      const requestId = uuid()
      const graphqlRequestBody = parseGraphqlRequest(
        details.request.postData?.text
      )

      if (!graphqlRequestBody) {
        return
      }

      setWebRequests((webRequests) =>
        webRequests.concat({
          id: requestId,
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
          },
        })
      )

      details.getContent((responseBody) => {
        setWebRequests((webRequests) => {
          return webRequests.map((webRequest) => {
            if (webRequest.id !== requestId) {
              return webRequest
            }
            return {
              ...webRequest,
              response: {
                ...webRequest.response,
                body: responseBody || "",
              },
            } as NetworkRequest
          })
        })
      })
    },
    [setWebRequests]
  )

  const clearWebRequests = () => {
    setWebRequests([])
  }

  useEffect(() => {
    const fetchHistoricWebRequests = async () => {
      const HARLog = await getHAR()
      for (const entry of HARLog.entries) {
        if ("getContent" in entry) {
          handleRequestFinished(entry as chrome.devtools.network.Request)
        }
      }
    }

    clearWebRequests()
    fetchHistoricWebRequests()
  }, [handleRequestFinished])

  useEffect(() => {
    return onRequestFinished(handleRequestFinished)
  }, [handleRequestFinished])

  return [webRequests, clearWebRequests]
}
