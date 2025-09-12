import { DocumentNode, QueryResult, useQuery } from "@apollo/client";
import { useContext } from "react";

import { SaleorContext } from "../components/SaleorProvider";

const CreateSaleorStateHook = <TData, TVariables>(
  query: DocumentNode,
): QueryResult<TData, TVariables> => {
  const saleorClient = useContext(SaleorContext);

  if (!saleorClient) {
    throw new Error(
      "Could not find saleor's apollo client in the context. Did you forget to wrap the root component in a <SaleorProvider>?",
    );
  }

  return useQuery<TData, TVariables>(query, {
    client: saleorClient._internal.apolloClient,
    fetchPolicy: "cache-only",
  });
};

export const hookStateFactory = <TData, TVariables>(
  query: DocumentNode,
): QueryResult<TData, TVariables> => CreateSaleorStateHook<TData, TVariables>(query);
