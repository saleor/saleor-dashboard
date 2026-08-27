import { type ApolloClient } from "@apollo/client";
import {
  _SearchAttributeOperandsDocument,
  type _SearchAttributeOperandsQuery,
  type _SearchAttributeOperandsQueryVariables,
  _SearchCategoriesOperandsDocument,
  type _SearchCategoriesOperandsQuery,
  type _SearchCategoriesOperandsQueryVariables,
  _SearchCollectionsOperandsDocument,
  type _SearchCollectionsOperandsQuery,
  type _SearchCollectionsOperandsQueryVariables,
  _SearchPageOperandsDocument,
  type _SearchPageOperandsQuery,
  type _SearchPageOperandsQueryVariables,
  _SearchProductOperandsDocument,
  type _SearchProductOperandsQuery,
  type _SearchProductOperandsQueryVariables,
  _SearchProductVariantOperandsDocument,
  type _SearchProductVariantOperandsQuery,
  type _SearchProductVariantOperandsQueryVariables,
  AttributeEntityTypeEnum,
} from "@dashboard/graphql";

import { hydrateChoiceCount } from "../filterChoicesPage";
import { createAttributeProductVariantOptionsFromAPI, createOptionsFromAPI } from "../Handler";
import {
  createAttributeMapFromQuery,
  mergeInitialProductsStateReferenceAttributes,
  type ReferenceAttributeChoices,
} from "./helpers";
import { type AttributeDTO } from "./product/InitialProductStateResponse";

export const loadAttributeFilterState = async (
  client: ApolloClient<unknown>,
  attribute: Record<string, string[]>,
  attributeReference: Record<string, string[]>,
): Promise<Record<string, AttributeDTO>> => {
  const allAttributeSlugs = [...Object.keys(attribute), ...Object.keys(attributeReference)];

  if (allAttributeSlugs.length === 0) {
    return {};
  }

  const regularChoiceIds = Object.values(attribute).flat().filter(Boolean);
  const attributeQuery = await client.query<
    _SearchAttributeOperandsQuery,
    _SearchAttributeOperandsQueryVariables
  >({
    query: _SearchAttributeOperandsDocument,
    variables: {
      attributesSlugs: allAttributeSlugs,
      choicesIds: regularChoiceIds,
      first: allAttributeSlugs.length,
      choicesFirst: hydrateChoiceCount(regularChoiceIds),
    },
  });

  let attributeMap = createAttributeMapFromQuery(attributeQuery);
  const referenceChoicePromises: Array<Promise<ReferenceAttributeChoices>> = [];

  for (const [slug, values] of Object.entries(attributeReference)) {
    const attributeDef = attributeMap[slug];

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
            .query<_SearchProductVariantOperandsQuery, _SearchProductVariantOperandsQueryVariables>(
              {
                query: _SearchProductVariantOperandsDocument,
                variables: {
                  first: values.length,
                  ids: values,
                },
              },
            )
            .then(result => ({
              slug,
              itemOptions: createAttributeProductVariantOptionsFromAPI(
                result.data.productVariants?.edges ?? [],
              ),
            })),
        );
        break;
      case AttributeEntityTypeEnum.CATEGORY:
        referenceChoicePromises.push(
          client
            .query<_SearchCategoriesOperandsQuery, _SearchCategoriesOperandsQueryVariables>({
              query: _SearchCategoriesOperandsDocument,
              variables: {
                first: values.length,
                categoriesSlugs: values,
              },
            })
            .then(result => ({
              slug,
              itemOptions: createOptionsFromAPI(result.data.categories?.edges ?? []),
            })),
        );
        break;
      case AttributeEntityTypeEnum.COLLECTION:
        referenceChoicePromises.push(
          client
            .query<_SearchCollectionsOperandsQuery, _SearchCollectionsOperandsQueryVariables>({
              query: _SearchCollectionsOperandsDocument,
              variables: {
                first: values.length,
                collectionsSlugs: values,
              },
            })
            .then(result => ({
              slug,
              itemOptions: createOptionsFromAPI(result.data.collections?.edges ?? []),
            })),
        );
        break;
    }
  }

  if (referenceChoicePromises.length > 0) {
    const referenceChoices = await Promise.all(referenceChoicePromises);

    attributeMap = mergeInitialProductsStateReferenceAttributes(
      { attribute: attributeMap },
      referenceChoices,
    ).attribute;
  }

  return attributeMap;
};
