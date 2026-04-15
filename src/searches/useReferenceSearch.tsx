import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { type AttributeDetailsFragment, type VariantAttributeFragment } from "@dashboard/graphql";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";

type AttributeWithReferenceTypes =
  | NonNullable<AttributeDetailsFragment>
  | NonNullable<VariantAttributeFragment>;

export const useReferenceProductSearch = (_refAttr: AttributeWithReferenceTypes | undefined) => {
  return useProductSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });
};

export const useReferencePageSearch = (_refAttr: AttributeWithReferenceTypes | undefined) => {
  return usePageSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });
};
