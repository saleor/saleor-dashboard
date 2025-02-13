import { useApolloClient } from "@apollo/client";
import {
  _GetChannelOperandsDocument,
  _GetChannelOperandsQuery,
  _GetChannelOperandsQueryVariables,
  _SearchAttributeOperandsDocument,
  _SearchAttributeOperandsQuery,
  _SearchAttributeOperandsQueryVariables,
  _SearchCategoriesOperandsDocument,
  _SearchCategoriesOperandsQuery,
  _SearchCategoriesOperandsQueryVariables,
  _SearchCollectionsOperandsDocument,
  _SearchCollectionsOperandsQuery,
  _SearchCollectionsOperandsQueryVariables,
  _SearchProductTypesOperandsDocument,
  _SearchProductTypesOperandsQuery,
  _SearchProductTypesOperandsQueryVariables,
} from "@dashboard/graphql";
import { useState } from "react";

import { FetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { createInitialProductStateFromData } from "../helpers";
import { InitialProductAPIResponse } from "../types";
import { InitialProductStateResponse } from "./InitialProductStateResponse";

export interface InitialProductAPIState {
  data: InitialProductStateResponse;
  loading: boolean;
  fetchQueries: (params: FetchingParams) => Promise<void>;
}

export const useProductInitialAPIState = (): InitialProductAPIState => {
  const client = useApolloClient();
  const [data, setData] = useState<InitialProductStateResponse>(
    InitialProductStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);
  const queriesToRun: Array<Promise<InitialProductAPIResponse>> = [];
  const fetchQueries = async ({
    category,
    collection,
    productType,
    channel,
    attribute,
  }: FetchingParams) => {
    if (channel.length > 0) {
      queriesToRun.push(
        client.query<_GetChannelOperandsQuery, _GetChannelOperandsQueryVariables>({
          query: _GetChannelOperandsDocument,
        }),
      );
    }

    if (collection.length > 0) {
      queriesToRun.push(
        client.query<_SearchCollectionsOperandsQuery, _SearchCollectionsOperandsQueryVariables>({
          query: _SearchCollectionsOperandsDocument,
          variables: {
            collectionsSlugs: collection,
            first: collection.length,
          },
        }),
      );
    }

    if (category.length > 0) {
      queriesToRun.push(
        client.query<_SearchCategoriesOperandsQuery, _SearchCategoriesOperandsQueryVariables>({
          query: _SearchCategoriesOperandsDocument,
          variables: {
            categoriesSlugs: category,
            first: category.length,
          },
        }),
      );
    }

    if (productType.length > 0) {
      queriesToRun.push(
        client.query<_SearchProductTypesOperandsQuery, _SearchProductTypesOperandsQueryVariables>({
          query: _SearchProductTypesOperandsDocument,
          variables: {
            productTypesSlugs: productType,
            first: productType.length,
          },
        }),
      );
    }

    if (Object.keys(attribute).length > 0) {
      queriesToRun.push(
        client.query<_SearchAttributeOperandsQuery, _SearchAttributeOperandsQueryVariables>({
          query: _SearchAttributeOperandsDocument,
          variables: {
            attributesSlugs: Object.keys(attribute),
            choicesIds: Object.values<string[]>(attribute).flat(),
            first: Object.keys(attribute).length,
          },
        }),
      );
    }

    const data = await Promise.all(queriesToRun);
    const initialState = createInitialProductStateFromData(data, channel);

    setData(
      new InitialProductStateResponse(
        initialState.category,
        initialState.attribute,
        initialState.channel,
        initialState.collection,
        initialState.productType,
        initialState.isAvailable,
        initialState.isPublished,
        initialState.isVisibleInListing,
        initialState.hasCategory,
        initialState.giftCard,
      ),
    );
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
