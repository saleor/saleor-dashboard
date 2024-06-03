import { ApolloQueryResult } from "@apollo/client";
import {
  _GetChannelOperandsQuery,
  _GetLegacyChannelOperandsQuery,
  _SearchAttributeOperandsQuery,
  _SearchCategoriesOperandsQuery,
  _SearchCollectionsOperandsQuery,
  _SearchProductTypesOperandsQuery,
} from "@dashboard/graphql";

import { createBooleanOptions } from "../../constants";
import { createOptionsFromAPI } from "../Handler";
import { InitialState } from "../InitialStateResponse";
import { InitialOrderState } from "./orders/InitialOrderState";
import { InitialAPIResponse, InitialOrderAPIResponse } from "./types";

const isChannelQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_GetChannelOperandsQuery> => "channels" in query.data;
const isChannelsQuery = (
  query: InitialOrderAPIResponse,
): query is ApolloQueryResult<_GetLegacyChannelOperandsQuery> => "channels" in query.data;
const isCollectionQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchCollectionsOperandsQuery> => "collections" in query.data;
const isCategoryQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchCategoriesOperandsQuery> => "categories" in query.data;
const isProductTypeQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchProductTypesOperandsQuery> => "productTypes" in query.data;
const isAttributeQuery = (
  query: InitialAPIResponse,
): query is ApolloQueryResult<_SearchAttributeOperandsQuery> => "attributes" in query.data;

export const createInitialStateFromData = (data: InitialAPIResponse[], channel: string[]) =>
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
          collection: createOptionsFromAPI(query.data?.collections?.edges ?? []),
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
          productType: createOptionsFromAPI(query.data?.productTypes?.edges ?? []),
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
                  choices:
                    node.inputType === "BOOLEAN"
                      ? createBooleanOptions()
                      : createOptionsFromAPI(node.choices?.edges ?? []),
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
      productType: [],
      isAvailable: createBooleanOptions(),
      isPublished: createBooleanOptions(),
      isVisibleInListing: createBooleanOptions(),
      hasCategory: createBooleanOptions(),
      giftCard: createBooleanOptions(),
      attribute: {},
    },
  );

export const createInitialOrderState = (data: InitialOrderAPIResponse[]) =>
  data.reduce<InitialOrderState>(
    (acc, query) => {
      if (isChannelsQuery(query)) {
        return {
          ...acc,
          channels: (query.data?.channels ?? []).map(({ id, name, slug }) => ({
            label: name,
            value: id,
            slug,
          })),
        };
      }

      return acc;
    },
    {
      channels: [],
      paymentStatus: [],
      status: [],
      authorizeStatus: [],
      chargeStatus: [],
      isClickAndCollect: createBooleanOptions(),
      isPreorder: createBooleanOptions(),
      giftCardBought: createBooleanOptions(),
      giftCardUsed: createBooleanOptions(),
      customer: [],
    },
  );
