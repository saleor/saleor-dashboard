import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  type SearchCategoriesWithTotalProductsQueryVariables,
  type SearchCollectionsWithTotalProductsQueryVariables,
  type SearchProductsQueryVariables,
} from "@dashboard/graphql";
import { type Dispatch, type SetStateAction, useState } from "react";

/*
 * Starting searches for the voucher assign pickers. They match what a freshly opened picker sends
 * (no query, no filters), so opening a picker fires one request instead of two.
 */
export const productPickerSearch: SearchProductsQueryVariables = {
  ...DEFAULT_INITIAL_SEARCH_DATA,
  // Products already on the voucher are dropped client-side, so a page of 20 can arrive empty on
  // a large catalog. Ask for more per request so the picker stays useful without leaning on
  // backfill for every page.
  first: 100,
  includeVariants: false,
  where: {},
};

export const variantPickerSearch: SearchProductsQueryVariables = {
  ...DEFAULT_INITIAL_SEARCH_DATA,
  includeVariants: true,
  where: {},
};

export const categoryPickerSearch: SearchCategoriesWithTotalProductsQueryVariables = {
  after: DEFAULT_INITIAL_SEARCH_DATA.after,
  first: DEFAULT_INITIAL_SEARCH_DATA.first,
  filter: { search: "" },
};

export const collectionPickerSearch: SearchCollectionsWithTotalProductsQueryVariables = {
  after: DEFAULT_INITIAL_SEARCH_DATA.after,
  first: DEFAULT_INITIAL_SEARCH_DATA.first,
  filter: { search: "" },
};

interface VoucherPickerSearches {
  productSearchVariables: SearchProductsQueryVariables;
  setProductSearchVariables: Dispatch<SetStateAction<SearchProductsQueryVariables>>;
  variantSearchVariables: SearchProductsQueryVariables;
  setVariantSearchVariables: Dispatch<SetStateAction<SearchProductsQueryVariables>>;
  categorySearchVariables: SearchCategoriesWithTotalProductsQueryVariables;
  setCategorySearchVariables: Dispatch<
    SetStateAction<SearchCategoriesWithTotalProductsQueryVariables>
  >;
  collectionSearchVariables: SearchCollectionsWithTotalProductsQueryVariables;
  setCollectionSearchVariables: Dispatch<
    SetStateAction<SearchCollectionsWithTotalProductsQueryVariables>
  >;
}

const PICKER_ACTIONS = [
  "assign-category",
  "assign-collection",
  "assign-product",
  "assign-variant",
] as const;

type PickerAction = (typeof PICKER_ACTIONS)[number];

const toOpenPicker = (action: string | undefined): PickerAction | null =>
  PICKER_ACTIONS.find(pickerAction => pickerAction === action) ?? null;

/**
 * Search variables for the voucher assign pickers, keyed off the page's `action` URL param. The
 * pickers mount only while open, so each one opens with an empty search box. The searches reset
 * whenever the open picker changes, however it was closed (including browser Back) or replaced,
 * so the first request of the next picker matches that empty box.
 */
export const useVoucherPickerSearches = (action: string | undefined): VoucherPickerSearches => {
  const [productSearchVariables, setProductSearchVariables] = useState(productPickerSearch);
  const [variantSearchVariables, setVariantSearchVariables] = useState(variantPickerSearch);
  const [categorySearchVariables, setCategorySearchVariables] = useState(categoryPickerSearch);
  const [collectionSearchVariables, setCollectionSearchVariables] =
    useState(collectionPickerSearch);
  const openPicker = toOpenPicker(action);
  const [previousPicker, setPreviousPicker] = useState(openPicker);

  // Adjust state while rendering rather than in an effect, so the reset lands in the same render
  // that closes or replaces the picker.
  if (previousPicker !== openPicker) {
    setPreviousPicker(openPicker);

    if (previousPicker !== null) {
      setProductSearchVariables(productPickerSearch);
      setVariantSearchVariables(variantPickerSearch);
      setCategorySearchVariables(categoryPickerSearch);
      setCollectionSearchVariables(collectionPickerSearch);
    }
  }

  return {
    productSearchVariables,
    setProductSearchVariables,
    variantSearchVariables,
    setVariantSearchVariables,
    categorySearchVariables,
    setCategorySearchVariables,
    collectionSearchVariables,
    setCollectionSearchVariables,
  };
};
