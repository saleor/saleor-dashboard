import { FieldNode, GraphQLError, OperationDefinitionNode } from "graphql"
import gql from "graphql-tag"

export interface IGraphqlRequestBody {
  query: string
  variables?: object
}

export type OperationDetails = {
  operationName: string
  operation: string
}

const isParsedGraphqlRequestValid = (
  requestPayloads: any[]
): requestPayloads is IGraphqlRequestBody[] => {
  const isValid = requestPayloads.every((payload) => {
    const isQueryValid = "query" in payload && typeof payload.query === "string"
    const isVariablesValid =
      "variables" in payload ? typeof payload.variables === "object" : true
    return isQueryValid && isVariablesValid
  })

  return isValid
}

export const parseGraphqlQuery = (queryString: any) => {
  return gql`
    ${queryString}
  `
}

export const parseGraphqlRequest = (
  requestBody?: string
): IGraphqlRequestBody[] | null => {
  if (!requestBody) {
    return null
  }

  try {
    const requestPayload = JSON.parse(requestBody)
    const requestPayloads = Array.isArray(requestPayload)
      ? requestPayload
      : [requestPayload]
    if (!isParsedGraphqlRequestValid(requestPayloads)) {
      throw new Error("Parsed requestBody is invalid")
    } else {
      return requestPayloads
    }
  } catch (err) {
    console.error("Unable to parse graphql request body", err)
    return null
  }
}

export const getPrimaryOperation = (
  requestBody?: string
): OperationDetails | null => {
  if (!requestBody) {
    return null
  }

  try {
    const request = JSON.parse(requestBody)
    const postData = Array.isArray(request) ? request : [request]
    const documentNode = parseGraphqlQuery(postData[0].query)
    const firstOperationDefinition = documentNode.definitions.find(
      (def) => def.kind === "OperationDefinition"
    ) as OperationDefinitionNode
    const field = firstOperationDefinition.selectionSet.selections.find(
      (selection) => selection.kind === "Field"
    ) as FieldNode
    const operationName =
      firstOperationDefinition.name?.value || field?.name.value

    if (!operationName) {
      throw new Error("Operation name could not be determined")
    }

    return {
      operationName,
      operation: firstOperationDefinition?.operation,
    }
  } catch (e) {
    return null
  }
}

export const getErrorMessages = (
  responseBody: string | undefined
): string[] | null => {
  if (!responseBody) {
    return null
  }
  try {
    const bodyParsed = JSON.parse(responseBody)
    if ("errors" in bodyParsed) {
      return bodyParsed.errors.map((error: GraphQLError) => error.message || "")
    }
    return []
  } catch (error) {
    return null
  }
}
