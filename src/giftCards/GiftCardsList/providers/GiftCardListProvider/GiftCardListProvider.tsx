import { ApolloError } from "@apollo/client";
import { IFilter } from "@dashboard/components/Filter";
import { ExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { getExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import {
  GiftCardListQuery,
  GiftCardListQueryVariables,
  useGiftCardListQuery,
} from "@dashboard/graphql";
import { UseFilterPresets, useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings, { UseListSettings } from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import { createPaginationState, PageInfo, PaginationState } from "@dashboard/hooks/usePaginator";
import { UseRowSelection, useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews, SortPage } from "@dashboard/types";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

import { getFilterQueryParam, getFilterVariables, storageUtils } from "../../filters";
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
  extends UseFilterPresets,
    UseRowSelection,
    UseListSettings<GiftCardListColummns>,
    SortPage<GiftCardUrlSortField> {
  giftCards: Array<
    ExtendedGiftCard<NonNullable<GiftCardListQuery["giftCards"]>["edges"][0]["node"]>
  >;
  pageInfo?: PageInfo;
  loading: boolean;
  params: GiftCardListUrlQueryParams;
  paginationState: PaginationState;
  numberOfColumns: number;
  totalCount: number;
  changeFilters: (filter: IFilter<any>) => void;
  resetFilters: () => void;
  handleSearchChange: (query: string) => void;
  isFilterPresetOpen: boolean;
  setFilterPresetOpen: Dispatch<SetStateAction<boolean>>;
}

const GiftCardsListContext = createContext<GiftCardsListConsumerProps | null>(null);

export const useGiftCardList = () => {
  const context = useContext(GiftCardsListContext);

  if (!context) {
    throw new Error("You are trying to use GiftCardsListContext outside of its provider");
  }

  return context;
};

export const GiftCardsListProvider: React.FC<GiftCardsListProviderProps> = ({
  children,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const { clearRowSelection, ...rowSelectionUtils } = useRowSelection(params);
  const filterUtils = useFilterPresets({
    reset: clearRowSelection,
    params,
    getUrl: giftCardListUrl,
    storageUtils,
  });
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    createUrl: giftCardListUrl,
    getFilterQueryParam,
    navigate,
    params,
    cleanupFn: clearRowSelection,
    keepActiveTab: true,
  });
  const { updateListSettings, settings } = useListSettings<GiftCardListColummns>(
    ListViews.GIFT_CARD_LIST,
  );

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
    const graphqlErrors = error?.graphQLErrors[0];

    if (graphqlErrors?.message) {
      notify({
        status: "error",
        text: graphqlErrors.message,
      });
    }
  };
  const { data } = useGiftCardListQuery({
    displayLoader: true,
    variables: queryVariables,
    handleError: handleGiftCardListError,
  });
  const giftCards = mapEdgesToItems(data?.giftCards)?.map(getExtendedGiftCard) ?? [];
  const providerValues: GiftCardsListConsumerProps = {
    onSort: handleSort,
    sort: getSortParams(params),
    giftCards,
    totalCount: data?.giftCards?.totalCount || 0,
    loading: !data,
    clearRowSelection,
    ...rowSelectionUtils,
    ...filterUtils,
    pageInfo: data?.giftCards?.pageInfo,
    paginationState,
    params,
    settings,
    updateListSettings,
    numberOfColumns,
    changeFilters,
    resetFilters,
    handleSearchChange,
    isFilterPresetOpen,
    setFilterPresetOpen,
  };

  return (
    <GiftCardsListContext.Provider value={providerValues}>{children}</GiftCardsListContext.Provider>
  );
};
