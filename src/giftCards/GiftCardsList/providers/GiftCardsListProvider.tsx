import useBulkActions, {
  UseBulkActionsProps
} from "@saleor/hooks/useBulkActions";
import useListSettings, {
  UseListSettings
} from "@saleor/hooks/useListSettings";
import {
  createPaginationState,
  PageInfo,
  PaginationState
} from "@saleor/hooks/usePaginator";
import { ListViews } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React, { createContext } from "react";

import { useGiftCardListQuery } from "../queries";
import { GiftCardListColummns, GiftCardListUrlQueryParams } from "../types";
import {
  GiftCardList_giftCards_edges_node,
  GiftCardListVariables
} from "../types/GiftCardList";

const numberOfColumns = 7;

interface GiftCardsListProviderProps {
  children: React.ReactNode;
  params: GiftCardListUrlQueryParams;
}

export interface GiftCardListDataProps {
  giftCards: GiftCardList_giftCards_edges_node[];
  pageInfo: PageInfo;
  loading: boolean;
  params: GiftCardListUrlQueryParams;
  paginationState: PaginationState;
  numberOfColumns: number;
}

export interface GiftCardsListConsumerProps
  extends UseBulkActionsProps,
    GiftCardListDataProps,
    UseListSettings<GiftCardListColummns> {
  selectedItemsCount: number;
}

export const GiftCardsListContext = createContext<GiftCardsListConsumerProps>(
  null
);

export const GiftCardsListProvider: React.FC<GiftCardsListProviderProps> = ({
  children,
  params
}) => {
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    []
  );

  const { updateListSettings, settings } = useListSettings<
    GiftCardListColummns
  >(ListViews.GIFT_CARD_LIST);

  const paginationState = createPaginationState(settings?.rowNumber, params);

  const queryVariables = React.useMemo<GiftCardListVariables>(
    () => ({
      ...paginationState
    }),
    [params]
  );

  const { data, loading } = useGiftCardListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const providerValues: GiftCardsListConsumerProps = {
    giftCards: mapEdgesToItems(data?.giftCards) || [],
    loading,
    isSelected,
    listElements,
    reset,
    toggleAll,
    toggle,
    selectedItemsCount: listElements.length,
    pageInfo: data?.giftCards?.pageInfo,
    paginationState,
    params,
    settings,
    updateListSettings,
    numberOfColumns
  };

  return (
    <GiftCardsListContext.Provider value={providerValues}>
      {children}
    </GiftCardsListContext.Provider>
  );
};
