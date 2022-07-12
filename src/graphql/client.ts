// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createFetch, createSaleorClient } from "@saleor/sdk";
import { createUploadLink } from "apollo-upload-client";

import { API_URI } from "../config";
import introspectionQueryResultData from "./fragmentTypes.generated";
import { TypedTypePolicies } from "./typePolicies.generated";

export const link = createUploadLink({
  credentials: "include",
  uri: API_URI,
  fetch: createFetch(),
});

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
    } as TypedTypePolicies,
  }),
  link,
});

export const saleorClient = createSaleorClient({
  apiUrl: API_URI,
  channel: "",
});
