import { type CollectionFilterInput } from "@dashboard/graphql";

import { type InitialCollectionStateResponse } from "../../ConditionalFilter/API/initialState/collections/InitialCollectionState";
import { useInitialCollectionState } from "../../ConditionalFilter/API/initialState/collections/useInitialCollectionsState";
import { useCollectionFilterAPIProvider } from "../../ConditionalFilter/API/providers/CollectionFilterAPIProvider";
import { STATIC_COLLECTION_OPTIONS } from "../../ConditionalFilter/constants";
import {
  createCollectionsQueryVariables,
  QUERY_API_TYPES,
} from "../../ConditionalFilter/queryVariables";
import {
  type CollectionFetchingParams,
  emptyCollectionFetchingParams,
} from "../../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { type ModalFilterConfig } from "../types";

export const collectionFilterConfig: ModalFilterConfig<
  { filter: CollectionFilterInput; channel: string | undefined },
  CollectionFetchingParams,
  InitialCollectionStateResponse
> = {
  staticOptions: STATIC_COLLECTION_OPTIONS,
  queryApiType: QUERY_API_TYPES.COLLECTION,
  emptyFetchingParams: emptyCollectionFetchingParams,
  filterProviderType: "collection",
  createQueryVariables: createCollectionsQueryVariables,
  useApiProvider: useCollectionFilterAPIProvider,
  useInitialState: useInitialCollectionState,
};
