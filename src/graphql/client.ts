// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createFetch, createSaleorClient } from "@saleor/sdk";
import { createUploadLink } from "apollo-upload-client";
import { useMemo } from "react";

import { API_URI, JUTRO_DOCTOR_API_URL } from "../config";
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

const createJutroGraphQLClient = () =>
  new ApolloClient({
    uri: JUTRO_DOCTOR_API_URL,
    cache: new InMemoryCache(),
  });

export const useJutroDoctorClient = () => {
  const client = useMemo(() => createJutroGraphQLClient(), []);

  return {
    client,
  };
};

export const saleorClient = createSaleorClient({
  apiUrl: API_URI,
  channel: "",
});
