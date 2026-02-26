import { type CategoryFilterInput } from "@dashboard/graphql";

import { type FilterAPIProvider } from "../../ConditionalFilter/API/FilterAPIProvider";
import { type InitialCategoryStateResponse } from "../../ConditionalFilter/API/initialState/category/InitialCategoryState";
import { useInitialCategoryState } from "../../ConditionalFilter/API/initialState/category/useInitialCategoryState";
import { STATIC_CATEGORY_OPTIONS } from "../../ConditionalFilter/constants";
import {
  createCategoryQueryVariables,
  QUERY_API_TYPES,
} from "../../ConditionalFilter/queryVariables";
import {
  type CategoryFetchingParams,
  emptyCategoryFetchingParams,
} from "../../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { type ModalFilterConfig } from "../types";

// Simple provider - categories don't need dynamic filter options
const useCategoryFilterAPIProvider = (): FilterAPIProvider => {
  return {
    fetchRightOptions: async () => [],
    fetchAttributeOptions: async () => [],
  };
};

export const categoryFilterConfig: ModalFilterConfig<
  CategoryFilterInput,
  CategoryFetchingParams,
  InitialCategoryStateResponse
> = {
  staticOptions: STATIC_CATEGORY_OPTIONS,
  queryApiType: QUERY_API_TYPES.CATEGORY,
  emptyFetchingParams: emptyCategoryFetchingParams,
  filterProviderType: "category",
  createQueryVariables: createCategoryQueryVariables,
  useApiProvider: useCategoryFilterAPIProvider,
  useInitialState: useInitialCategoryState,
};
