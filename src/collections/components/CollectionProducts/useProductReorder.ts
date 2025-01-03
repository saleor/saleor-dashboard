import { PAGINATE_BY } from "@dashboard/config";
import { useReorderProductsInCollectionMutation } from "@dashboard/graphql";
import { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";

import { useCollectionId } from "./useCollectionId";
import { useProductReorderOptimistic } from "./useProductReorderOptimistic";

export const useProductReorder = () => {
  const collectionId = useCollectionId();
  const [paginationState] = useLocalPaginationState(PAGINATE_BY);
  const { createOptimisticResponse } = useProductReorderOptimistic();

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
