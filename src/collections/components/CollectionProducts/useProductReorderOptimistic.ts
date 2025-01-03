import useRouter from "use-react-router";

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

export const useProductReorderOptimistic = () => {
  const {
    match: {
      params: { id: collectionId },
    },
  } = useRouter<{ id: string }>();
  const { shift, isShiftExceedPage } = useProductEdges();

  const createOptimisticResponse = (productIds: string[], shiftOffset: number) => {
    const { exceededProductIds } = isShiftExceedPage(productIds, -shiftOffset);

    const shifted = shift(productIds, -shiftOffset);

    const exceededEdges = shifted.map(edge => {
      const isExceededId = exceededProductIds.includes(edge.node.id);
      const newId = isExceededId ? "optimistic_" + edge.node.id : edge.node.id;

      return {
        ...edge,
        node: {
          ...edge.node,
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
