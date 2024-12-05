// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { createFetch, createSaleorClient } from "@saleor/sdk";
import { createUploadLink } from "apollo-upload-client";

import { getApiUrl } from "../config";
import introspectionQueryResultData from "./fragmentTypes.generated";
import { TypedTypePolicies } from "./typePolicies.generated";

const attachVariablesLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      source: "dashboard",
    },
  }));

  return forward(operation).map(data => ({
    ...data,
    extensions: {
      ...data.extensions,
      variables: operation.variables,
    },
  }));
});

export const link = attachVariablesLink.concat(
  createUploadLink({
    credentials: "include",
    uri: getApiUrl(),
    fetch: createFetch(),
  }) as unknown as ApolloLink, // type mismatch between apollo-upload-client and @apollo/cient
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    possibleTypes: introspectionQueryResultData.possibleTypes,
    typePolicies: {
      CountryDisplay: {
        keyFields: ["code"],
      },
      Money: {
        merge: false,
      },
      TaxedMoney: {
        merge: false,
      },
      Weight: {
        merge: false,
      },
      Shop: {
        keyFields: [],
      },
      AttributeValue: {
        fields: {
          /**
           * Since, API sometimes creates an empty slug,
           * We need to handle that case also on front-end,
           * so after fix that problem in the API, the UI will ablle
           * to handle it.
           *
           * If the slug is empty, use the name
           */
          slug: (givenSlug, { readField }) => {
            if (!givenSlug) {
              return readField("name");
            }

            return givenSlug;
          },
        },
      },
    } as TypedTypePolicies,
  }),
  link,
});

export const saleorClient = createSaleorClient({
  apiUrl: getApiUrl(),
  channel: "",
});
