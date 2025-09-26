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
  _SearchWarehouseOperandsQuery,
  ChannelCurrenciesQuery,
} from "@dashboard/graphql";

import { createBooleanOptions } from "../../constants";
import { AttributeInputType } from "../../FilterElement/ConditionOptions";
import { ItemOption } from "../../FilterElement/ConditionValue";
import { createCustomerOptionsFromAPI, createOptionsFromAPI } from "../Handler";
import { InitialAttributesState } from "./attributes/InitialAttributesState";
import { InitialCollectionState } from "./collections/InitialCollectionState";
import { InitialGiftCardsState } from "./giftCards/InitialGiftCardsState";
import { InitialOrderState } from "./orders/InitialOrderState";
import { InitialPageState } from "./page/InitialPageState";
import { AttributeDTO, InitialProductState } from "./product/InitialProductStateResponse";
import {
  InitialAttributesAPIResponse,
  InitialCollectionAPIResponse,
  InitialGiftCardsAPIResponse,
  InitialOrderAPIResponse,
  InitialPageAPIResponse,
  InitialProductAPIResponse,
  InitialVoucherAPIResponse,
} from "./types";
import { InitialVouchersState } from "./vouchers/InitialVouchersState";

// Helper function to convert ItemOption[] to AttributeDTO choices format
const convertItemOptionsToAttributeChoices = (
  itemOptions: ItemOption[],
): AttributeDTO["choices"] => {
  return itemOptions.map(option => {
    const choice: any = {
      label: option.label,
      value: option.value,
      slug: option.slug,
    };

    // Only include originalSlug if it exists and is not null
    if (option.originalSlug != null) {
      choice.originalSlug = option.originalSlug;
    }

    return choice;
  });
};

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

const isWarehouseQuery = (
  query: InitialOrderAPIResponse,
): query is ApolloQueryResult<_SearchWarehouseOperandsQuery> => "warehouses" in query.data;

export const createInitialProductStateFromData = (
  data: InitialProductAPIResponse[],
  channel: string[],
): InitialProductState => {
  return data.reduce<InitialProductState>(
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
            query.data?.attributes?.edges.reduce((accAttr, { node }) => {
              if (!node.slug || !node.inputType) return accAttr;

              const attributeChoices =
                node.inputType === "BOOLEAN"
                  ? convertItemOptionsToAttributeChoices(createBooleanOptions())
                  : convertItemOptionsToAttributeChoices(
                      createOptionsFromAPI(node.choices?.edges ?? []),
                    );

              return {
                ...accAttr,
                [node.slug]: {
                  choices: attributeChoices,
                  slug: node.slug,
                  value: node.id,
                  label: node.name ?? "",
                  inputType: node.inputType as AttributeInputType,
                  entityType: node.entityType ?? undefined,
                },
              };
            }, acc.attribute || {}) ?? acc.attribute,
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
};

export type ReferenceAttributeChoices = { slug: string; itemOptions: ItemOption[] };
export const mergeInitialProductsStateReferenceAttributes = (
  initialState: InitialProductState,
  referenceChoices: ReferenceAttributeChoices[],
) => {
  return referenceChoices.reduce((acc, { slug, itemOptions }) => {
    if (acc.attribute[slug]) {
      // Convert choices to ensure type compatibility
      acc.attribute[slug].choices = convertItemOptionsToAttributeChoices(itemOptions);
    }

    return acc;
  }, initialState);
};

export const createInitialOrderState = (data: InitialOrderAPIResponse[]) =>
  data.reduce<InitialOrderState>(
    (acc, query) => {
      if (isChannelsQuery(query)) {
        const channelOptions = (query.data?.channels ?? []).map(({ id, name, slug }) => ({
          label: name,
          value: id,
          slug,
        }));

        return {
          ...acc,
          channelId: channelOptions,
        };
      }

      if (isWarehouseQuery(query)) {
        return {
          ...acc,
          fulfillmentWarehouse: createOptionsFromAPI(query.data?.warehouses?.edges ?? []),
        };
      }

      return acc;
    },
    {
      status: [],
      fulfillmentStatus: [],
      authorizeStatus: [],
      chargeStatus: [],
      isClickAndCollect: createBooleanOptions(),
      isGiftCardBought: createBooleanOptions(),
      isGiftCardUsed: createBooleanOptions(),
      hasInvoices: createBooleanOptions(),
      hasFulfillments: createBooleanOptions(),
      createdAt: "",
      updatedAt: "",
      invoicesCreatedAt: "",
      totalGross: "",
      totalNet: "",
      user: [],
      channelId: [],
      ids: [],
      metadata: "",
      number: [],
      userEmail: [],
      voucherCode: [],
      linesCount: [],
      checkoutId: [],
      linesMetadata: "",
      transactionsMetadata: "",
      transactionsPaymentType: [],
      transactionsCardBrand: [],
      fulfillmentsMetadata: "",
      billingPhoneNumber: [],
      billingCountry: [],
      shippingPhoneNumber: [],
      shippingCountry: [],
      fulfillmentWarehouse: [],
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
      published: createBooleanOptions(),
      metadata: [],
    },
  );

export const createInitialAttributeState = (data: InitialAttributesAPIResponse[]) =>
  data.reduce<InitialAttributesState>(
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
      attributeTypes: [],
      filterableInStorefront: createBooleanOptions(),
      isVariantOnly: createBooleanOptions(),
      valueRequired: createBooleanOptions(),
      visibleInStorefront: createBooleanOptions(),
    },
  );
