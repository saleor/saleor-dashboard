import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import { createPaginationState } from "@saleor/hooks/usePaginator";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React, { createContext } from "react";

import { useGiftCardListQuery } from "../GiftCardUpdatePage/queries";
import { GiftCardListVariables } from "../GiftCardUpdatePage/types/GiftCardList";
import { GiftCardListUrlQueryParams } from "./types";

interface GiftCardsListProviderProps {
  children: React.ReactNode;
  params: GiftCardListUrlQueryParams;
}

export const GiftCardsListContext = createContext<GiftCardsListConsumerProps>(
  null
);

export const GiftCardsListProvider: React.FC<GiftCardsListProviderProps> = ({
  children,
  params
}) => {
  // TEMP
  const initiallySelected = [];

  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    initiallySelected
  );

  const paginationState = createPaginationState(
    DEFAULT_INITIAL_SEARCH_DATA.first,
    params
  );

  const queryVariables = React.useMemo<GiftCardListVariables>(
    () => ({
      ...paginationState
    }),
    [params]
  );

  const { data, loading } = useGiftCardListQuery({
    displayLoader: true,
    variables: {
      ...paginationState,
      ...queryVariables
    }
  });

  const providerValues: GiftCardsListConsumerProps = {
    isSelected,
    listElements,
    reset,
    toggleAll,
    toggle,
    selectedItemsCount: listElements.length,
    loading,
    giftCards: mapEdgesToItems(data?.giftCards) || [],
    pageInfo: data?.giftCards?.pageInfo,
    paginationState,
    params
  };

  return (
    <GiftCardsListContext.Provider value={providerValues}>
      {children}
    </GiftCardsListContext.Provider>
  );
};
