import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeEntityTypeEnum,
  type SearchCategoriesQueryVariables,
  type SearchCollectionsQueryVariables,
  type SearchPagesQueryVariables,
  type SearchProductsQueryVariables,
} from "@dashboard/graphql";
import { useMemo } from "react";

import { type AssignAttributeValueDialogFilterChangeMap } from "./AssignAttributeValueDialog";
import {
  mergePageReferenceWhereConstraints,
  mergeProductReferenceWhereConstraints,
  type ReferenceWhereConstraints,
} from "./mergeReferenceTypeWhereConstraints";

interface UseAssignAttributeValueDialogFilterChangeHandlersParams {
  refetchProducts: (variables: SearchProductsQueryVariables) => void;
  refetchPages: (variables: SearchPagesQueryVariables) => void | Promise<unknown>;
  refetchCategories: (variables: SearchCategoriesQueryVariables) => void | Promise<unknown>;
  refetchCollections: (variables: SearchCollectionsQueryVariables) => void | Promise<unknown>;
  referenceWhereConstraints?: ReferenceWhereConstraints;
}

export const useAssignAttributeValueDialogFilterChangeHandlers = ({
  refetchProducts,
  refetchPages,
  refetchCategories,
  refetchCollections,
  referenceWhereConstraints,
}: UseAssignAttributeValueDialogFilterChangeHandlersParams): AssignAttributeValueDialogFilterChangeMap =>
  useMemo(
    () => ({
      [AttributeEntityTypeEnum.PRODUCT]: (where, channel, query): void => {
        refetchProducts({
          ...DEFAULT_INITIAL_SEARCH_DATA,
          where: mergeProductReferenceWhereConstraints(
            where,
            referenceWhereConstraints?.productTypeIds,
          ),
          channel,
          query,
          includeVariants: false,
        });
      },
      [AttributeEntityTypeEnum.PRODUCT_VARIANT]: (where, channel, query): void => {
        refetchProducts({
          ...DEFAULT_INITIAL_SEARCH_DATA,
          where: mergeProductReferenceWhereConstraints(
            where,
            referenceWhereConstraints?.productTypeIds,
          ),
          channel,
          query,
          includeVariants: true,
        });
      },
      // Page, category and collection pickers show a pending search while the refetch runs.
      [AttributeEntityTypeEnum.PAGE]: (where, query) =>
        refetchPages({
          ...DEFAULT_INITIAL_SEARCH_DATA,
          where: mergePageReferenceWhereConstraints(where, referenceWhereConstraints?.pageTypeIds),
          query,
        }),
      [AttributeEntityTypeEnum.CATEGORY]: (filterVariables, query) =>
        refetchCategories({
          after: DEFAULT_INITIAL_SEARCH_DATA.after,
          first: DEFAULT_INITIAL_SEARCH_DATA.first,
          filter: {
            ...filterVariables,
            search: query,
          },
        }),
      [AttributeEntityTypeEnum.COLLECTION]: (filterVariables, channel, query) =>
        refetchCollections({
          after: DEFAULT_INITIAL_SEARCH_DATA.after,
          first: DEFAULT_INITIAL_SEARCH_DATA.first,
          filter: {
            ...filterVariables,
            search: query,
          },
          channel,
        }),
    }),
    [
      refetchCategories,
      refetchCollections,
      refetchPages,
      refetchProducts,
      referenceWhereConstraints?.pageTypeIds,
      referenceWhereConstraints?.productTypeIds,
    ],
  );
