import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings, {
  UseListSettings
} from "@saleor/hooks/useListSettings";
import {
  createPaginationState,
  PageInfo,
  PaginationState
} from "@saleor/hooks/usePaginator";
import { Node } from "@saleor/types";
import { ListViews } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React, { createContext } from "react";

import { useGiftCardListQuery } from "../GiftCardUpdatePage/queries";
import {
  GiftCardList_giftCards_edges_node,
  GiftCardListVariables
} from "../GiftCardUpdatePage/types/GiftCardList";
import { GiftCardListColummns, GiftCardListUrlQueryParams } from "./types";

interface GiftCardsListProviderProps {
  children: React.ReactNode;
  params: GiftCardListUrlQueryParams;
}

export interface GiftCardsListConsumerProps
  extends UseListSettings<GiftCardListColummns> {
  isSelected: (id: string) => boolean;
  listElements: string[];
  toggle: (id: string) => void;
  toggleAll: (items: Node[], selected: number) => void;
  reset: () => void;
  selectedItemsCount: number;
  giftCards: GiftCardList_giftCards_edges_node[];
  pageInfo: PageInfo;
  loading: boolean;
  params: GiftCardListUrlQueryParams;
  paginationState: PaginationState;
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

  const { updateListSettings, settings } = useListSettings<
    GiftCardListColummns
  >(ListViews.GIFT_CARD_LIST);

  const paginationState = createPaginationState(settings.rowNumber, params);

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
    updateListSettings
  };

  return (
    <GiftCardsListContext.Provider value={providerValues}>
      {children}
    </GiftCardsListContext.Provider>
  );
};
