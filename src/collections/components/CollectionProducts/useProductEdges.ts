import { useApolloClient } from "@apollo/client";
import { PAGINATE_BY } from "@dashboard/config";
import { CollectionDetailsDocument, CollectionDetailsQuery } from "@dashboard/graphql";
import { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";

import { useCollectionId } from "./useCollectionId";

export const useProductEdges = () => {
  const client = useApolloClient();
  const collectionId = useCollectionId();
  const [paginationState] = useLocalPaginationState(PAGINATE_BY);

  const queryData = client.readQuery<CollectionDetailsQuery>({
    query: CollectionDetailsDocument,
    variables: {
      id: collectionId,
      ...paginationState,
    },
  });

  const edges = queryData?.collection?.products?.edges || [];

  const shift = (productIds: string[], shiftAmount: number) => {
    const idsSet = new Set(productIds);
    const shiftedArray = [...edges];

    const indicesToShift = shiftedArray
      .map((item, index) => (idsSet.has(item.node.id) ? index : -1))
      .filter(index => index !== -1);

    indicesToShift.forEach(index => {
      const newIndex = index + shiftAmount;

      if (newIndex >= 0 && newIndex < shiftedArray.length) {
        const [movedItem] = shiftedArray.splice(index, 1);

        shiftedArray.splice(newIndex, 0, movedItem);
      }
    });

    return shiftedArray;
  };

  const isShiftExceedPage = (productIds: string[], shiftAmount: number) => {
    const totalEdges = edges.length - 1;
    const productIndexes = productIds.map(id => edges.findIndex(edge => edge.node.id === id));

    const belowZeroIndexes = productIndexes.filter(index => index + shiftAmount < 0);
    const aboveTotalEdgesIndexes = productIndexes.filter(index => index + shiftAmount > totalEdges);

    const isBelowZero = belowZeroIndexes.length > 0;
    const isAboveTotalEdges = aboveTotalEdgesIndexes.length > 0;
    const isExceed = isBelowZero || isAboveTotalEdges;
    const exceededProductIds = [...belowZeroIndexes, ...aboveTotalEdgesIndexes].map(
      index => edges[index].node.id,
    );

    return { isExceed, exceededProductIds };
  };

  return {
    shift,
    isShiftExceedPage,
  };
};
