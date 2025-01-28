import { useReorderProductsInCollectionMutation } from "@dashboard/graphql";
import { PaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { useIntl } from "react-intl";

import { Product } from "./types";
import { useCollectionId } from "./useCollectionId";
import { useProductReorderOptimistic } from "./useProductReorderOptimistic";

interface ProductReorderProps {
  paginationState: PaginationState;
}

export const useProductReorder = ({ paginationState }: ProductReorderProps) => {
  const collectionId = useCollectionId();
  const notify = useNotifier();
  const intl = useIntl();
  const { createForDroppedItem } = useProductReorderOptimistic({ paginationState });

  const [reorder, data] = useReorderProductsInCollectionMutation();

  const move = async (products: Product[], productId: string, shift: number) => {
    await reorder({
      variables: {
        collectionId,
        moves: [
          {
            productId,
            sortOrder: shift,
          },
        ],
        ...paginationState,
      },
      optimisticResponse: createForDroppedItem(products, productId),
    });

    notify({
      text: intl.formatMessage({
        id: "XAvER/",
        defaultMessage: "Product reordered",
      }),
      status: "success",
    });
  };

  return {
    move,
    data,
  };
};
