// @ts-strict-ignore
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type ProductWhereInput } from "@dashboard/graphql";
import { useAssignPickerListDisplayState } from "@dashboard/hooks/useAssignPickerListDisplayState";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { usePickerBackfill } from "@dashboard/hooks/usePickerBackfill";
import { useStalePickerList } from "@dashboard/hooks/useStalePickerList";
import { type Container, type FetchMoreProps } from "@dashboard/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { type Products, type SelectedChannel } from "./types";
import {
  applySelectAllVisibleToggle,
  getSelectAllVisibleCheckboxState,
  getSelectedIdsFromDict,
  hasMultiSelectionChanged,
  isProductAvailableInVoucherChannels,
} from "./utils";

export const ASSIGN_PRODUCT_PICKER_SCROLL_ID = "assignProductScrollableDialog";

export type AssignProductSelectAllMode = "off" | "when-scoped";

export interface UseAssignProductPickerProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  onClose: () => void;
  open: boolean;
  skipFetchOnOpen?: boolean;
  onSelectionChange?: (selection: {
    products: Array<Container & Omit<Partial<Products[number]>, "name">>;
    count: number;
    hasChanges: boolean;
  }) => void;
  maxSelection?: number;
  selectAllMode?: AssignProductSelectAllMode;
  /**
   * Hide products the caller has already used up (assigned to the voucher, the collection,
   * the channel). Filtering here rather than before `products` lets the picker notice when a
   * page has been filtered down to nothing and pull in the next one.
   */
  excludeProduct?: (product: Products[number]) => boolean;
  /** Bumped when a new search starts, so backfill gets its page budget back. */
  backfillResetKey?: string;
  /**
   * Drop already-selected products once they stop being available. Only useful for
   * dialogs where availability changes while the dialog is open.
   * @default false
   */
  pruneUnavailableSelection?: boolean;
  onMaxSelectionReached?: (params: { skipped: number }) => void;
}

export const useAssignProductPicker = ({
  confirmButtonState,
  selectedChannels,
  productUnavailableText,
  hasMore,
  loading,
  products: rawProducts,
  onClose,
  onFilterChange,
  onFetchMore,
  onSubmit,
  selectedIds,
  open,
  skipFetchOnOpen = false,
  onSelectionChange,
  maxSelection,
  selectAllMode = "off",
  excludeProduct,
  backfillResetKey,
  pruneUnavailableSelection = false,
  onMaxSelectionReached,
}: UseAssignProductPickerProps) => {
  const products = useMemo(
    () => (excludeProduct ? rawProducts.filter(product => !excludeProduct(product)) : rawProducts),
    [excludeProduct, rawProducts],
  );

  // Client-side exclusion is itself a scope (e.g. "hide already listed"), so select-all
  // should appear even when the user hasn't typed a query yet.
  const hasExclusionFilter = Boolean(excludeProduct);

  const backfill = usePickerBackfill({
    enabled: hasExclusionFilter,
    open,
    loading,
    hasMore: Boolean(hasMore),
    rawItemCount: rawProducts.length,
    filteredItemCount: products.length,
    onFetchMore,
    resetKey: backfillResetKey,
  });

  const [productsDict, setProductsDict] = useState<Record<string, boolean>>({});
  const [initialSelection, setInitialSelection] = useState<Record<string, boolean>>({});
  const { combinedFilters, clearFilters, hasActiveFilters } = useModalProductFilterContext();
  const selectedIdsRef = useRef(selectedIds);

  selectedIdsRef.current = selectedIds;

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    skipFetchOnOpen,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

  const productsData = useRef<Products>([]);

  const resetDialogState = () => {
    resetQuery();
    clearFilters();
  };

  const handleClose = () => {
    resetDialogState();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setProductsDict({});
      setInitialSelection({});
      productsData.current = [];

      return;
    }

    const nextInitialSelection = selectedIdsRef.current || {};

    setInitialSelection(nextInitialSelection);
    setProductsDict(nextInitialSelection);
    productsData.current = [];
  }, [open]);

  const hasSelectionChanged = useMemo(
    () => hasMultiSelectionChanged(productsDict, initialSelection),
    [productsDict, initialSelection],
  );
  const selectedCount = useMemo(() => getSelectedIdsFromDict(productsDict).length, [productsDict]);

  const onSelectionChangeRef = useRef(onSelectionChange);

  onSelectionChangeRef.current = onSelectionChange;

  const previousSelectionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      previousSelectionRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const onSelectionChangeHandler = onSelectionChangeRef.current;

    if (!onSelectionChangeHandler) {
      return;
    }

    const selectedProductsAsArray = Object.keys(productsDict).filter(key => productsDict[key]);
    const selectionKey = selectedProductsAsArray.sort().join(",");

    if (selectionKey === previousSelectionRef.current) {
      return;
    }

    previousSelectionRef.current = selectionKey;

    onSelectionChangeHandler({
      products: selectedProductsAsArray.map(id => {
        const productDetails = productsData.current.find(product => product.id === id);

        return {
          id,
          name: productDetails?.name,
          ...(productDetails ?? {}),
        };
      }),
      count: selectedProductsAsArray.length,
      hasChanges: hasSelectionChanged,
    });
  }, [hasSelectionChanged, productsDict]);

  useModalDialogOpen(open, {
    onOpen: resetDialogState,
    onClose: resetDialogState,
  });

  const handleSubmit = () => {
    const selectedProductsAsArray = Object.keys(productsDict)
      .filter(key => productsDict[key])
      .map(key => key);

    onSubmit(
      selectedProductsAsArray.map(id => {
        const productDetails = productsData.current.find(product => product.id === id);

        return {
          id,
          name: productDetails?.name,
          ...(productDetails ?? {}),
        };
      }),
    );
  };

  const handleChange = (productId: string) => {
    const productData = products.find(product => product.id === productId);

    if (productData && !productsData.current.some(product => product.id === productId)) {
      productsData.current = [...productsData.current, productData];
    }

    setProductsDict(prev => ({
      ...prev,
      [productId]: prev[productId] ? false : true,
    }));
  };

  const displayedProducts = useStalePickerList(products, loading, open);
  const { showEmptyState: hasNothingToShow, showListLoading } = useAssignPickerListDisplayState(
    loading,
    displayedProducts.length,
  );

  // A page that was filtered down to nothing is not an empty catalog. Claiming "no products
  // found" while pages are still coming in — or while the user could ask for more — is the
  // dead end that makes large catalogs look empty after a few rows get assigned.
  const showBackfillExhausted = hasNothingToShow && backfill.isExhausted;
  const showEmptyState = hasNothingToShow && !backfill.isBackfilling && !showBackfillExhausted;
  const showListLoadingWithBackfill =
    showListLoading || (hasNothingToShow && backfill.isBackfilling);

  const isProductAvailable = useCallback(
    (product: Products[number]) => {
      // Excluded products are filtered out of the list, but a selection made before the
      // exclusion applied can still be sitting in the dict.
      if (excludeProduct?.(product)) {
        return false;
      }

      return isProductAvailableInVoucherChannels(product.channelListings, selectedChannels);
    },
    [excludeProduct, selectedChannels],
  );

  useEffect(
    function pruneUnavailableSelectedProducts() {
      if (!pruneUnavailableSelection) {
        return;
      }

      setProductsDict(prev => {
        const selectedIds = Object.keys(prev).filter(id => prev[id]);

        if (selectedIds.length === 0) {
          return prev;
        }

        let changed = false;
        const next = { ...prev };

        for (const id of selectedIds) {
          const product =
            productsData.current.find(item => item.id === id) ??
            products.find(item => item.id === id);

          if (product && !isProductAvailable(product)) {
            next[id] = false;
            changed = true;
          }
        }

        return changed ? next : prev;
      });
    },
    [isProductAvailable, products, pruneUnavailableSelection],
  );

  const isListScoped = hasActiveFilters || query.trim().length > 0 || hasExclusionFilter;

  const selectableVisibleProducts = useMemo(
    () => displayedProducts.filter(product => isProductAvailable(product)),
    [displayedProducts, isProductAvailable],
  );

  const selectableVisibleIds = useMemo(
    () => selectableVisibleProducts.map(product => product.id),
    [selectableVisibleProducts],
  );

  const selectAllCheckboxState = useMemo(
    () => getSelectAllVisibleCheckboxState(selectableVisibleIds, productsDict),
    [productsDict, selectableVisibleIds],
  );

  const showSelectAll =
    selectAllMode === "when-scoped" &&
    isListScoped &&
    !showListLoadingWithBackfill &&
    !showEmptyState &&
    selectableVisibleIds.length > 0;

  const showSelectAllScrollHint = showSelectAll && hasMore;

  const cacheProducts = useCallback((productsToCache: Products) => {
    productsToCache.forEach(product => {
      if (!productsData.current.some(cached => cached.id === product.id)) {
        productsData.current = [...productsData.current, product];
      }
    });
  }, []);

  const handleToggleSelectAllVisible = useCallback(() => {
    const { nextDict, skipped } = applySelectAllVisibleToggle({
      productsDict,
      selectableVisibleIds,
      maxSelection,
    });

    const newlySelectedIds = selectableVisibleIds.filter(id => nextDict[id] && !productsDict[id]);

    if (newlySelectedIds.length > 0) {
      cacheProducts(displayedProducts.filter(product => newlySelectedIds.includes(product.id)));
    }

    setProductsDict(nextDict);

    if (skipped > 0) {
      onMaxSelectionReached?.({ skipped });
    }
  }, [
    cacheProducts,
    displayedProducts,
    maxSelection,
    onMaxSelectionReached,
    productsDict,
    selectableVisibleIds,
  ]);

  return {
    confirmButtonState,
    displayedProducts,
    handleChange,
    handleClose,
    handleSubmit,
    handleToggleSelectAllVisible,
    hasMore,
    hasSelectionChanged,
    isProductAvailable,
    loading,
    onFetchMore,
    onQueryChange,
    productUnavailableText,
    productsDict,
    query,
    resumeBackfill: backfill.resumeBackfill,
    selectAllCheckboxState,
    selectedCount,
    showBackfillExhausted,
    showEmptyState,
    showListLoading: showListLoadingWithBackfill,
    showSelectAll,
    showSelectAllScrollHint,
  };
};

export type AssignProductPicker = ReturnType<typeof useAssignProductPicker>;
