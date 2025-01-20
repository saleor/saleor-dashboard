import { PaginationState } from "@dashboard/hooks/useLocalPaginator";

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
  const { shift, isShiftExceedPage } = useProductEdges({ paginationState });

  const createOptimisticResponse = (productIds: string[], shiftOffset: number) => {
    const { exceededProductIds } = isShiftExceedPage(productIds, -shiftOffset);

    const shifted = shift(productIds, -shiftOffset);

    const exceededEdges = shifted.map(edge => {
      const nodeId = edge?.node?.id || "";
      const isExceededId = exceededProductIds.includes(nodeId);
      const newId = isExceededId ? "optimistic_" + nodeId : nodeId;

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
    createOptimisticResponse,
  };
};
