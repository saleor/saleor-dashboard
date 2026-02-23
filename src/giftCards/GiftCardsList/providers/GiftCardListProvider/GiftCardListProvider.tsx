import { type ApolloError } from "@apollo/client";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createGiftCardQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { type IFilter } from "@dashboard/components/Filter/types";
import { type ExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { getExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import {
  type GiftCardListQuery,
  type GiftCardListQueryVariables,
  useGiftCardListQuery,
} from "@dashboard/graphql";
import { type UseFilterPresets, useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings, { type UseListSettings } from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import {
  createPaginationState,
  type PageInfo,
  type PaginationState,
} from "@dashboard/hooks/usePaginator";
import { type UseRowSelection, useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews, type SortPage } from "@dashboard/types";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { createContext, type Dispatch, type SetStateAction, useContext, useState } from "react";
import * as React from "react";

import { getFilterQueryParam, storageUtils } from "../../filters";
import {
  type GiftCardListColummns,
  type GiftCardListUrlQueryParams,
  type GiftCardUrlSortField,
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

export const GiftCardsListProvider = ({ children, params }: GiftCardsListProviderProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const { clearRowSelection, ...rowSelectionUtils } = useRowSelection(params);
  const { valueProvider } = useConditionalFilterContext();
  const filters = createGiftCardQueryVariables(valueProvider.value);

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

  const newQueryVariables = React.useMemo<GiftCardListQueryVariables>(
    () => ({
      ...paginationState,
      filter: {
        ...filters,
        code: params.query,
      },
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber, valueProvider.value],
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
    variables: newQueryVariables,
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
