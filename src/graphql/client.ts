// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { ENABLED_SERVICE_NAME_HEADER, getApiUrl } from "@dashboard/config";
import { createFetch, createSaleorClient } from "@saleor/sdk";
import { createUploadLink } from "apollo-upload-client";

import introspectionQueryResultData from "./fragmentTypes.generated";
import introspectionQueryResultDataStaging from "./fragmentTypesStaging.generated";
import { isStagingSchema } from "./schemaVersion";
import { TypedTypePolicies } from "./typePolicies.generated";

// Select the appropriate fragmentTypes and typePolicies based on schema version
const introspectionData = isStagingSchema()
  ? introspectionQueryResultDataStaging
  : introspectionQueryResultData;

const attachVariablesLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const contextHeaders: Record<string, string> = { ...headers };

    if (ENABLED_SERVICE_NAME_HEADER) {
      contextHeaders["source-service-name"] = "saleor.dashboard";
    }

    return {
      headers: contextHeaders,
    };
  });

  return forward(operation).map(data => ({
    ...data,
    extensions: {
      ...data.extensions,
      variables: operation.variables,
    },
  }));
});

const link = attachVariablesLink.concat(
  createUploadLink({
    credentials: "include",
    uri: getApiUrl(),
    // TODO: Remove once @saleor/sdk is removed in favor of local implementation for auth
    // Note this has to be as typeof fetch: ts-expect-error breaks TS in non-strict mode, without it strict mode breaks
    fetch: createFetch() as typeof fetch,
  }) as unknown as ApolloLink, // type mismatch between apollo-upload-client and @apollo/cient
);

export const apolloClient = new ApolloClient({
  connectToDevTools: process.env.NODE_ENV === "development",
  cache: new InMemoryCache({
    possibleTypes: introspectionData.possibleTypes,
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
      App: {
        keyFields: false,
      },
    } as TypedTypePolicies,
  }),
  link,
});

export const saleorClient = createSaleorClient({
  apiUrl: getApiUrl(),
  channel: "",
});
