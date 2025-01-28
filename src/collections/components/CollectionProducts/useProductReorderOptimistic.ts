import { PaginationState } from "@dashboard/hooks/useLocalPaginator";

import { Product } from "./types";
import { useCollectionId } from "./useCollectionId";
import { useProductEdges } from "./useProductEdges";

const createOptimisticResponseForEdges = (collectionId: string, edges: any) => ({
  collectionReorderProducts: {
    __typename: "CollectionReorderProducts" as const,
    collection: {
      __typename: "Collection" as const,
      id: collectionId,
      products: {
        __typename: "ProductCountableConnection" as const,
        edges: edges,
        pageInfo: {
          __typename: "PageInfo" as const,
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
      },
    },
    errors: [],
  },
  __typename: "Mutation" as const,
});

interface ProductReorderOptimisticProps {
  paginationState: PaginationState;
}

export const useProductReorderOptimistic = ({ paginationState }: ProductReorderOptimisticProps) => {
  const collectionId = useCollectionId();
  const { edges } = useProductEdges({ paginationState });

  const createForDroppedItem = (listAfterSort: Product[], activeNodeId: string) => {
    const exceededEdges = listAfterSort
      .map(product => edges.find(edge => edge?.node?.id === product.id))
      .filter(Boolean)
      .map(edge => {
        const nodeId = edge?.node?.id || "";
        const isMoved = activeNodeId == nodeId;
        const newId = isMoved ? "moved_" + nodeId : nodeId;

        return {
          ...edge,
          node: {
            ...edge?.node,
            id: newId,
          },
        };
      });

    return createOptimisticResponseForEdges(collectionId, exceededEdges);
  };

  return {
    createForDroppedItem,
  };
};
