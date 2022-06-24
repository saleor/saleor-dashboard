import { ApolloError } from "@apollo/client";
import { ExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { getExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import { giftCardListUrl } from "@saleor/giftCards/urls";
import {
  GiftCardListQuery,
  GiftCardListQueryVariables,
  useGiftCardListQuery,
} from "@saleor/graphql";
import useBulkActions, {
  UseBulkActionsProps,
} from "@saleor/hooks/useBulkActions";
import useListSettings, {
  UseListSettings,
} from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import {
  createPaginationState,
  PageInfo,
  PaginationState,
} from "@saleor/hooks/usePaginator";
import { ListViews, SortPage } from "@saleor/types";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React, { createContext, useContext } from "react";

import { getFilterVariables } from "../../GiftCardListSearchAndFilters/filters";
import {
  GiftCardListColummns,
  GiftCardListUrlQueryParams,
  GiftCardUrlSortField,
} from "../../types";
import { getSortQueryVariables } from "./sort";

const numberOfColumns = 7;

interface GiftCardsListProviderProps {
  children: React.ReactNode;
  params: GiftCardListUrlQueryParams;
}

export interface GiftCardsListConsumerProps
  extends UseBulkActionsProps,
    UseListSettings<GiftCardListColummns>,
    SortPage<GiftCardUrlSortField> {
  giftCards: Array<
    ExtendedGiftCard<GiftCardListQuery["giftCards"]["edges"][0]["node"]>
  >;
  pageInfo: PageInfo;
  loading: boolean;
  params: GiftCardListUrlQueryParams;
  paginationState: PaginationState;
  numberOfColumns: number;
  totalCount: number;
  selectedItemsCount: number;
}

export const GiftCardsListContext = createContext<GiftCardsListConsumerProps>(
  null,
);

export const useGiftCardList = () => useContext(GiftCardsListContext);

export const GiftCardsListProvider: React.FC<GiftCardsListProviderProps> = ({
  children,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();

  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    [],
  );

  const { updateListSettings, settings } = useListSettings<
    GiftCardListColummns
  >(ListViews.GIFT_CARD_LIST);

  usePaginationReset(giftCardListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);

  const handleSort = createSortHandler(navigate, giftCardListUrl, params);

  const queryVariables = React.useMemo<GiftCardListQueryVariables>(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, paginationState],
  );

  const handleGiftCardListError = (error: ApolloError) => {
    const { message } = error?.graphQLErrors[0];

    if (!!message) {
      notify({
        status: "error",
        text: message,
      });
    }
  };

  const { data, loading } = useGiftCardListQuery({
    displayLoader: true,
    variables: queryVariables,
    handleError: handleGiftCardListError,
  });

  const giftCards = mapEdgesToItems(data?.giftCards)?.map(getExtendedGiftCard);

  const providerValues: GiftCardsListConsumerProps = {
    onSort: handleSort,
    sort: getSortParams(params),
    giftCards,
    totalCount: data?.giftCards?.totalCount || 0,
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
    numberOfColumns,
  };

  return (
    <GiftCardsListContext.Provider value={providerValues}>
      {children}
    </GiftCardsListContext.Provider>
  );
};
