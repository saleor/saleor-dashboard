import { type PageWhereInput } from "@dashboard/graphql";

import { type InitialPageStateResponse } from "../../ConditionalFilter/API/initialState/page/InitialPageState";
import { useInitialPageState } from "../../ConditionalFilter/API/initialState/page/useInitialPageState";
import { usePageAPIProvider } from "../../ConditionalFilter/API/providers/PageFilterAPIProvider";
import { STATIC_PAGE_OPTIONS } from "../../ConditionalFilter/constants";
import { type FilterContainer } from "../../ConditionalFilter/FilterElement";
import { FiltersQueryBuilder, QueryApiType } from "../../ConditionalFilter/FiltersQueryBuilder";
import { type PageFetchingParams } from "../../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { type ModalFilterConfig } from "../types";

const emptyPageFetchingParams: PageFetchingParams = {
  pageTypes: [],
};

export const createPageWhereQueryVariables = (filterContainer: FilterContainer): PageWhereInput => {
  const builder = new FiltersQueryBuilder<PageWhereInput>({
    apiType: QueryApiType.WHERE,
    filterContainer,
  });
  const { filters } = builder.build();

  return filters;
};

export const pageFilterConfig: ModalFilterConfig<
  PageWhereInput,
  PageFetchingParams,
  InitialPageStateResponse
> = {
  staticOptions: STATIC_PAGE_OPTIONS,
  queryApiType: QueryApiType.WHERE,
  lockedFilterField: "pageTypes",
  emptyFetchingParams: emptyPageFetchingParams,
  filterProviderType: "page",
  createQueryVariables: createPageWhereQueryVariables,
  useApiProvider: usePageAPIProvider,
  useInitialState: useInitialPageState,
};
