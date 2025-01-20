import { useReorderProductsInCollectionMutation } from "@dashboard/graphql";
import { PaginationState } from "@dashboard/hooks/useLocalPaginator";

import { useCollectionId } from "./useCollectionId";
import { useProductReorderOptimistic } from "./useProductReorderOptimistic";

interface ProductReorderProps {
  paginationState: PaginationState;
}

export const useProductReorder = ({ paginationState }: ProductReorderProps) => {
  const collectionId = useCollectionId();
  const { createOptimisticResponse } = useProductReorderOptimistic({ paginationState });

  const [reorder, data] = useReorderProductsInCollectionMutation();

  const move = (productIds: string[], shift: number) => {
    reorder({
      variables: {
        collectionId,
        moves: productIds.map(productId => ({
          productId,
          sortOrder: shift,
        })),
        ...paginationState,
      },
      optimisticResponse: createOptimisticResponse(productIds, shift),
    });
  };

  return {
    move,
    data,
  };
};
