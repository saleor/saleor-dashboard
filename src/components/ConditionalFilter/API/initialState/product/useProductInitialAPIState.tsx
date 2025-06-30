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
  _SearchPageOperandsDocument,
  _SearchPageOperandsQuery,
  _SearchPageOperandsQueryVariables,
  _SearchProductOperandsDocument,
  _SearchProductOperandsQuery,
  _SearchProductOperandsQueryVariables,
  _SearchProductTypesOperandsDocument,
  _SearchProductTypesOperandsQuery,
  _SearchProductTypesOperandsQueryVariables,
  _SearchProductVariantOperandsDocument,
  _SearchProductVariantOperandsQuery,
  _SearchProductVariantOperandsQueryVariables,
  AttributeEntityTypeEnum,
} from "@dashboard/graphql";
import { useState } from "react";

import { FetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { createAttributeProductVariantOptionsFromAPI, createOptionsFromAPI } from "../../Handler";
import {
  createInitialProductStateFromData,
  mergeInitialProductsStateReferenceAttributes,
  ReferenceAttributeChoices,
} from "../helpers";
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
    attributeReference,
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

    // Fetch attribute definitions for both regular and reference attributes
    // (We need the definitions for URL parsing, but values are fetched separately)
    const allAttributeSlugs = [...Object.keys(attribute), ...Object.keys(attributeReference)];

    if (allAttributeSlugs.length > 0) {
      // Only fetch choices values for regular attributes, not reference attributes
      // (if we try fetching reference attribute options Saleor returns 500 error)
      const regularChoiceIds = Object.values(attribute).flat().filter(Boolean);

      queriesToRun.push(
        client.query<_SearchAttributeOperandsQuery, _SearchAttributeOperandsQueryVariables>({
          query: _SearchAttributeOperandsDocument,
          variables: {
            attributesSlugs: allAttributeSlugs,
            choicesIds: regularChoiceIds,
            first: allAttributeSlugs.length,
          },
        }),
      );
    }

    const data = await Promise.all(queriesToRun);
    let initialState = createInitialProductStateFromData(data, channel);

    // Fetch Choices for Reference Attributes
    const referenceChoicePromises: Array<Promise<ReferenceAttributeChoices>> = [];

    for (const [slug, values] of Object.entries(attributeReference)) {
      const attributeDef = initialState.attribute[slug];

      if (!attributeDef) continue;

      switch (attributeDef.entityType) {
        case AttributeEntityTypeEnum.PAGE:
          referenceChoicePromises.push(
            client
              .query<_SearchPageOperandsQuery, _SearchPageOperandsQueryVariables>({
                query: _SearchPageOperandsDocument,
                variables: {
                  first: values.length,
                  pageSlugs: values,
                },
              })
              .then(result => ({
                slug,
                itemOptions: createOptionsFromAPI(result.data.pages?.edges ?? []),
              })),
          );
          break;
        case AttributeEntityTypeEnum.PRODUCT:
          referenceChoicePromises.push(
            client
              .query<_SearchProductOperandsQuery, _SearchProductOperandsQueryVariables>({
                query: _SearchProductOperandsDocument,
                variables: {
                  first: values.length,
                  productSlugs: values,
                },
              })
              .then(result => ({
                slug,
                itemOptions: createOptionsFromAPI(result.data.products?.edges ?? []),
              })),
          );
          break;
        case AttributeEntityTypeEnum.PRODUCT_VARIANT:
          referenceChoicePromises.push(
            client
              .query<
                _SearchProductVariantOperandsQuery,
                _SearchProductVariantOperandsQueryVariables
              >({
                query: _SearchProductVariantOperandsDocument,
                variables: {
                  first: values.length,
                  ids: values,
                },
              })
              .then(result => ({
                slug,
                itemOptions: createAttributeProductVariantOptionsFromAPI(
                  result.data.productVariants?.edges ?? [],
                ),
              })),
          );
          break;
      }
    }

    if (referenceChoicePromises.length > 0) {
      const referenceChoices = await Promise.all(referenceChoicePromises);

      initialState = mergeInitialProductsStateReferenceAttributes(initialState, referenceChoices);
    }

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
