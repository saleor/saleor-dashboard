import { ApolloQueryResult } from "@apollo/client";
import {
  _GetChannelOperandsQuery,
  _GetLegacyChannelOperandsQuery,
  _SearchAttributeOperandsQuery,
  _SearchCategoriesOperandsQuery,
  _SearchCollectionsOperandsQuery,
  _SearchCustomersOperandsQuery,
  _SearchPageTypesOperandsQuery,
  _SearchProductOperandsQuery,
  _SearchProductTypesOperandsQuery,
  ChannelCurrenciesQuery,
} from "@dashboard/graphql";

import { createBooleanOptions } from "../../constants";
import { createCustomerOptionsFromAPI, createOptionsFromAPI } from "../Handler";
import { InitialCollectionState } from "./collections/InitialCollectionState";
import { InitialGiftCardsState } from "./giftCards/InitialGiftCardsState";
import { InitialOrderState } from "./orders/InitialOrderState";
import { InitialPageState } from "./page/InitialPageState";
import { InitialProductState } from "./product/InitialProductStateResponse";
import {
  InitialCollectionAPIResponse,
  InitialGiftCardsAPIResponse,
  InitialOrderAPIResponse,
  InitialPageAPIResponse,
  InitialProductAPIResponse,
  InitialVoucherAPIResponse,
} from "./types";
import { InitialVouchersState } from "./vouchers/InitialVouchersState";

const isChannelQuery = (
  query: InitialProductAPIResponse,
): query is ApolloQueryResult<_GetChannelOperandsQuery> => "channels" in query.data;
const isChannelsQuery = (
  query: InitialOrderAPIResponse,
): query is ApolloQueryResult<_GetLegacyChannelOperandsQuery> => "channels" in query.data;
const isCollectionQuery = (
  query: InitialProductAPIResponse,
): query is ApolloQueryResult<_SearchCollectionsOperandsQuery> => "collections" in query.data;
const isCategoryQuery = (
  query: InitialProductAPIResponse,
): query is ApolloQueryResult<_SearchCategoriesOperandsQuery> => "categories" in query.data;
const isProductTypeQuery = (
  query: InitialProductAPIResponse,
): query is ApolloQueryResult<_SearchProductTypesOperandsQuery> => "productTypes" in query.data;
const isAttributeQuery = (
  query: InitialProductAPIResponse,
): query is ApolloQueryResult<_SearchAttributeOperandsQuery> => "attributes" in query.data;
const isPageTypesQuery = (
  query: InitialPageAPIResponse,
): query is ApolloQueryResult<_SearchPageTypesOperandsQuery> => "pageTypes" in query.data;
const isCustomerQuery = (
  query: InitialGiftCardsAPIResponse,
): query is ApolloQueryResult<_SearchCustomersOperandsQuery> => "customers" in query.data;
const isProductQuery = (
  query: InitialGiftCardsAPIResponse,
): query is ApolloQueryResult<_SearchProductOperandsQuery> => "products" in query.data;
const isCurrencyQuery = (
  query: InitialGiftCardsAPIResponse,
): query is ApolloQueryResult<ChannelCurrenciesQuery> => "shop" in query.data;

export const createInitialProductStateFromData = (
  data: InitialProductAPIResponse[],
  channel: string[],
) =>
  data.reduce<InitialProductState>(
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
      ids: [],
      created: "",
      updatedAt: "",
    },
  );

export const createInitialVoucherState = (data: InitialVoucherAPIResponse[]) =>
  data.reduce<InitialVouchersState>(
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
      discountType: [],
      voucherStatus: [],
    },
  );

export const createInitialPageState = (data: InitialPageAPIResponse[]) =>
  data.reduce<InitialPageState>(
    (acc, query) => {
      if (isPageTypesQuery(query)) {
        return {
          ...acc,
          pageTypes: createOptionsFromAPI(query.data?.pageTypes?.edges ?? []),
        };
      }

      return acc;
    },
    {
      pageTypes: [],
    },
  );

export const createInitialGiftCardsState = (
  data: InitialGiftCardsAPIResponse[],
  tags: string[],
): InitialGiftCardsState => {
  return data.reduce(
    (acc, query) => {
      if (isCustomerQuery(query)) {
        return {
          ...acc,
          usedBy: createCustomerOptionsFromAPI(query.data?.customers?.edges ?? []),
        };
      }

      if (isProductQuery(query)) {
        return {
          ...acc,
          products: createOptionsFromAPI(query.data?.products?.edges ?? []),
        };
      }

      if (isCurrencyQuery(query)) {
        return {
          ...acc,
          currency: query.data.shop.channelCurrencies.map(currency => ({
            label: currency,
            value: currency,
            slug: currency,
          })),
        };
      }

      return acc;
    },
    {
      currency: [],
      isActive: createBooleanOptions(),
      products: [],
      tags: tags?.map(tag => ({ label: tag, value: tag, slug: tag })) ?? [],
      usedBy: [],
    } as InitialGiftCardsState,
  );
};

export const createInitialCollectionState = (
  data: InitialCollectionAPIResponse[],
  channel: string[],
) =>
  data.reduce<InitialCollectionState>(
    (acc, query) => {
      if (isChannelQuery(query)) {
        return {
          ...acc,
          channel: (query.data?.channels ?? [])
            .filter(({ slug }) => channel.includes(slug))
            .map(({ id, name, slug }) => ({ label: name, value: id, slug })),
        };
      }

      return acc;
    },
    {
      channel: [],
      published: [],
      metadata: [],
    },
  );
