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

interface UseAssignAttributeValueDialogFilterChangeHandlersParams {
  refetchProducts: (variables: SearchProductsQueryVariables) => void;
  refetchPages: (variables: SearchPagesQueryVariables) => void;
  refetchCategories: (variables: SearchCategoriesQueryVariables) => void;
  refetchCollections: (variables: SearchCollectionsQueryVariables) => void;
}

export const useAssignAttributeValueDialogFilterChangeHandlers = ({
  refetchProducts,
  refetchPages,
  refetchCategories,
  refetchCollections,
}: UseAssignAttributeValueDialogFilterChangeHandlersParams): AssignAttributeValueDialogFilterChangeMap =>
  useMemo(
    () => ({
      [AttributeEntityTypeEnum.PRODUCT]: (where, channel, query): void => {
        refetchProducts({
          ...DEFAULT_INITIAL_SEARCH_DATA,
          where,
          channel,
          query,
        });
      },
      [AttributeEntityTypeEnum.PRODUCT_VARIANT]: (where, channel, query): void => {
        refetchProducts({
          ...DEFAULT_INITIAL_SEARCH_DATA,
          where,
          channel,
          query,
        });
      },
      [AttributeEntityTypeEnum.PAGE]: (where, query): void => {
        refetchPages({
          ...DEFAULT_INITIAL_SEARCH_DATA,
          where,
          query,
        });
      },
      [AttributeEntityTypeEnum.CATEGORY]: (filterVariables, query): void => {
        refetchCategories({
          after: DEFAULT_INITIAL_SEARCH_DATA.after,
          first: DEFAULT_INITIAL_SEARCH_DATA.first,
          filter: {
            ...filterVariables,
            search: query,
          },
        });
      },
      [AttributeEntityTypeEnum.COLLECTION]: (filterVariables, channel, query): void => {
        refetchCollections({
          after: DEFAULT_INITIAL_SEARCH_DATA.after,
          first: DEFAULT_INITIAL_SEARCH_DATA.first,
          filter: {
            ...filterVariables,
            search: query,
          },
          channel,
        });
      },
    }),
    [refetchCategories, refetchCollections, refetchPages, refetchProducts],
  );
