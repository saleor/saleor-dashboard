import { ProductWhereInput } from "@dashboard/graphql";

import { InitialProductStateResponse } from "../../ConditionalFilter/API/initialState/product/InitialProductStateResponse";
import { useProductInitialAPIState } from "../../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { useProductFilterAPIProvider } from "../../ConditionalFilter/API/providers/ProductFilterAPIProvider";
import { STATIC_PRODUCT_OPTIONS } from "../../ConditionalFilter/constants";
import {
  createProductQueryVariables,
  QUERY_API_TYPES,
} from "../../ConditionalFilter/queryVariables";
import {
  emptyFetchingParams,
  FetchingParams,
} from "../../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { ModalFilterConfig } from "../types";

export const productFilterConfig: ModalFilterConfig<
  ProductWhereInput,
  FetchingParams,
  InitialProductStateResponse
> = {
  staticOptions: STATIC_PRODUCT_OPTIONS,
  queryApiType: QUERY_API_TYPES.PRODUCT,
  lockedFilterField: "productType",
  emptyFetchingParams,
  filterProviderType: "product",
  createQueryVariables: createProductQueryVariables,
  useApiProvider: useProductFilterAPIProvider,
  useInitialState: useProductInitialAPIState,
};
