import {
  type ProductVariantSibling,
  useProductVariantSiblings,
} from "@dashboard/products/hooks/useProductVariantSiblings";
import { Box, DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductContextSwitcherProps {
  productId: string;
  selectedId: string;
  disabled?: boolean;
  /**
   * When translating a variant that is not in the first loaded page, pass it so
   * the combobox can keep the current value visible until scroll loads it.
   */
  selectedVariant?: Pick<ProductVariantSibling, "id" | "name" | "sku"> | null;
  onItemChange: (id: string, type: "variant" | "main") => void;
}

const toSibling = (
  variant: Pick<ProductVariantSibling, "id" | "name" | "sku">,
): ProductVariantSibling => ({
  __typename: "ProductVariant",
  id: variant.id,
  name: variant.name,
  sku: variant.sku ?? null,
  media: null,
});

const variantOptionLabel = (variant: Pick<ProductVariantSibling, "id" | "name" | "sku">): string =>
  variant.name || variant.sku || variant.id;

/**
 * Downshift treats selectedItem by reference (itemToKey defaults to identity).
 * A new Option object on each options refresh rewrites the input back to the
 * selected label — keep the same reference while value/label are unchanged.
 */
const useStableOption = (option: Option | null): Option | null => {
  const ref = useRef<Option | null>(null);

  if (!option) {
    ref.current = null;

    return null;
  }

  if (ref.current?.value !== option.value || ref.current?.label !== option.label) {
    ref.current = option;
  }

  return ref.current;
};

export const ProductContextSwitcher = ({
  productId,
  selectedId,
  selectedVariant = null,
  disabled,
  onItemChange,
}: ProductContextSwitcherProps) => {
  const intl = useIntl();
  const mainProductLabel = intl.formatMessage(messages.mainProduct);
  /**
   * `undefined` = show the committed translation target.
   * `null` = user cleared the field (Macaw onChange(null)); allow free typing.
   * Do not clear selection on every keystroke — that sets value→null and Downshift
   * resets inputValue to itemToString(null) (""), wiping the query.
   */
  const [selectionOverride, setSelectionOverride] = useState<Option | null | undefined>(undefined);

  const currentVariant = useMemo(() => {
    if (!selectedVariant || selectedVariant.id === productId) {
      return null;
    }

    return toSibling(selectedVariant);
  }, [productId, selectedVariant]);

  const {
    variants,
    offPageCurrent,
    loadingMore,
    hasNextPage,
    loadMore,
    initialLoading,
    search,
    setSearch,
  } = useProductVariantSiblings({
    productId,
    currentVariant,
    skip: !productId,
  });

  useEffect(() => {
    setSelectionOverride(undefined);
  }, [selectedId]);

  const mainProductOption = useMemo<Option>(
    () => ({ label: mainProductLabel, value: productId }),
    [mainProductLabel, productId],
  );

  const options = useMemo(() => {
    const variantOptions: Option[] = [];
    const seen = new Set<string>();

    if (offPageCurrent) {
      seen.add(offPageCurrent.id);
      variantOptions.push({
        label: variantOptionLabel(offPageCurrent),
        value: offPageCurrent.id,
      });
    }

    for (const variant of variants) {
      if (seen.has(variant.id)) {
        continue;
      }

      seen.add(variant.id);
      variantOptions.push({
        label: variantOptionLabel(variant),
        value: variant.id,
      });
    }

    // Keep Main Product at the top when not filtering by search.
    if (!search.trim()) {
      return [mainProductOption, ...variantOptions];
    }

    return variantOptions;
  }, [mainProductOption, offPageCurrent, search, variants]);

  const selectedOption = useMemo<Option | null>(() => {
    if (selectedId === productId) {
      return mainProductOption;
    }

    if (selectedVariant && selectedVariant.id === selectedId) {
      return {
        label: variantOptionLabel(selectedVariant),
        value: selectedId,
      };
    }

    const fromOptions = options.find(option => option.value === selectedId);

    if (fromOptions) {
      return fromOptions;
    }

    return selectedId
      ? {
          label: selectedId,
          value: selectedId,
        }
      : null;
  }, [mainProductOption, options, productId, selectedId, selectedVariant]);

  const stableSelectedOption = useStableOption(selectedOption);
  const value = selectionOverride !== undefined ? selectionOverride : stableSelectedOption;

  const handleScrollEnd = useCallback(() => {
    if (hasNextPage && !loadingMore) {
      loadMore();
    }
  }, [hasNextPage, loadMore, loadingMore]);

  const handleChange = useCallback(
    (option: Option | null) => {
      if (!option) {
        setSelectionOverride(null);

        return;
      }

      setSelectionOverride(undefined);
      setSearch("");
      onItemChange(option.value, option.value === productId ? "main" : "variant");
    },
    [onItemChange, productId, setSearch],
  );

  const handleBlur = useCallback(() => {
    // Defer so option click can commit before we restore the committed value.
    window.setTimeout(() => {
      setSelectionOverride(undefined);
      setSearch("");
    }, 0);
  }, [setSearch]);

  return (
    <Box __minWidth="220px">
      <DynamicCombobox
        data-test-id="translation-product-context-switcher"
        label={intl.formatMessage(messages.translating)}
        options={options}
        value={value}
        disabled={disabled || initialLoading}
        loading={loadingMore}
        onInputValueChange={setSearch}
        onScrollEnd={handleScrollEnd}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Box>
  );
};

ProductContextSwitcher.displayName = "ProductContextSwitcher";
