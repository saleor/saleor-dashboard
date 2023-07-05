import { ApolloQueryResult, useApolloClient } from "@apollo/client";
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
import { useEffect, useState } from "react";

import { FetchingParams } from "../../ValueProvider/TokenArray/fetchingParams";
import { createOptionsFromAPI } from "../Handler";
import { InitialState } from "../InitialStateResponse";
import { InitialAPIResponse } from "./types";

const isChannelQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_GetChannelOperandsQuery> =>
  "channels" in query.data;

const isCollectionQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchCollectionsOperandsQuery> =>
  "collections" in query.data;

const isCategoryQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchCategoriesOperandsQuery> =>
  "categories" in query.data;

const isProductTypeQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchProductTypesOperandsQuery> =>
  "productTypes" in query.data;

const isAttributeQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchAttributeOperandsQuery> =>
  "attributes" in query.data;

export const createInitialStateFromData = (
  data: InitialAPIResponse[],
  channel: string[],
) =>
  data.reduce<InitialState>(
    (acc, query) => {
      if (isChannelQuery(query)) {
        return {
          ...acc,
          channel: (query.data?.channels ?? [])
            .filter(({ slug }) => channel.includes(slug))
            .map(({ id, name, slug }) => ({ label: name, value: id, slug })),
        };
      }

      if (isCollectionQuery(query)) {
        return {
          ...acc,
          collection: createOptionsFromAPI(
            query.data?.collections?.edges ?? [],
          ),
        };
      }

      if (isCategoryQuery(query)) {
        return {
          ...acc,
          category: createOptionsFromAPI(query.data?.categories?.edges ?? []),
        };
      }

      if (isProductTypeQuery(query)) {
        return {
          ...acc,
          producttype: createOptionsFromAPI(
            query.data?.productTypes?.edges ?? [],
          ),
        };
      }

      if (isAttributeQuery(query)) {
        return {
          ...acc,
          attribute:
            query.data?.attributes?.edges.reduce(
              (acc, { node }) => ({
                ...acc,
                [node.slug ?? ""]: {
                  choices: createOptionsFromAPI(node.choices?.edges ?? []),
                  slug: node?.slug,
                  value: node?.id,
                  label: node?.name,
                  inputType: node?.inputType,
                },
              }),
              {},
            ) ?? {},
        };
      }

      return acc;
    },
    {
      channel: [],
      collection: [],
      category: [],
      producttype: [],
      attribute: {},
    },
  );

export const useDataFromAPI = ({
  category,
  collection,
  producttype,
  channel,
  attribute,
}: FetchingParams) => {
  const client = useApolloClient();
  const [data, setData] = useState<InitialAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queriesToRun: Array<Promise<InitialAPIResponse>> = [];

    const fetchQueries = async () => {
      const data = await Promise.all(queriesToRun);
      setData(data);
      setLoading(false);
    };

    if (channel.length > 0) {
      queriesToRun.push(
        client.query<
          _GetChannelOperandsQuery,
          _GetChannelOperandsQueryVariables
        >({
          query: _GetChannelOperandsDocument,
        }),
      );
    }

    if (collection.length > 0) {
      queriesToRun.push(
        client.query<
          _SearchCollectionsOperandsQuery,
          _SearchCollectionsOperandsQueryVariables
        >({
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
        client.query<
          _SearchCategoriesOperandsQuery,
          _SearchCategoriesOperandsQueryVariables
        >({
          query: _SearchCategoriesOperandsDocument,
          variables: {
            categoriesSlugs: category,
            first: category.length,
          },
        }),
      );
    }

    if (producttype.length > 0) {
      queriesToRun.push(
        client.query<
          _SearchProductTypesOperandsQuery,
          _SearchProductTypesOperandsQueryVariables
        >({
          query: _SearchProductTypesOperandsDocument,
          variables: {
            productTypesSlugs: producttype,
            first: producttype.length,
          },
        }),
      );
    }

    if (Object.keys(attribute).length > 0) {
      queriesToRun.push(
        client.query<
          _SearchAttributeOperandsQuery,
          _SearchAttributeOperandsQueryVariables
        >({
          query: _SearchAttributeOperandsDocument,
          variables: {
            attributesSlugs: Object.keys(attribute),
            choicesIds: Object.values<string[]>(attribute).flat(),
            first: Object.keys(attribute).length,
          },
        }),
      );
    }

    void fetchQueries();
  }, []);

  return {
    data,
    loading,
  };
};
