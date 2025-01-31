import { useApolloClient } from "@apollo/client";
import { CollectionProductsDocument, CollectionProductsQuery } from "@dashboard/graphql";
import { PaginationState } from "@dashboard/hooks/useLocalPaginator";

import { useCollectionId } from "./useCollectionId";

interface ProductEdgesProps {
  paginationState: PaginationState;
}

export const useProductEdges = ({ paginationState }: ProductEdgesProps) => {
  const client = useApolloClient();
  const collectionId = useCollectionId();

  const queryData = client.readQuery<CollectionProductsQuery>({
    query: CollectionProductsDocument,
    variables: {
      id: collectionId,
      ...paginationState,
    },
  });

  const edges = queryData?.collection?.products?.edges || [];

  return { edges };
};
