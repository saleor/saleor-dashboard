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

  const shift = (idsToShift: string[], shiftAmount: number) => {
    const edgesIds = edges.map(edge => edge.node.id);
    const newArray = [...edgesIds];

    idsToShift.sort((a, b) => {
      if (shiftAmount > 0) {
        return newArray.indexOf(b) - newArray.indexOf(a);
      }

      return newArray.indexOf(a) - newArray.indexOf(b);
    });

    idsToShift.forEach(id => {
      const index = newArray.indexOf(id);

      if (index !== -1) {
        const newIndex = index + shiftAmount;

        newArray.splice(index, 1);
        newArray.splice(newIndex, 0, id);
      }
    });

    return newArray.map(id => edges.find(edge => edge.node.id === id)).filter(Boolean);
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
