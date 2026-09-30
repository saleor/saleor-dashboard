import { useProductTranslationContextQuery } from "@dashboard/graphql";
import { isMainSchema } from "@dashboard/graphql/schemaVersion";
import {
  type ProductVariantSibling,
  useProductVariantSiblings,
} from "@dashboard/products/hooks/useProductVariantSiblings";
import { Box, DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type IntlShape, useIntl } from "react-intl";

import { messages } from "./messages";

type ProductContextSwitcherItemType = "main" | "variant" | "media";

interface ProductContextMedia {
  id: string;
  alt: string;
}

interface ProductContextOption extends Option {
  type: ProductContextSwitcherItemType;
}

interface ProductContextSwitcherProps {
  productId: string;
  selectedId: string;
  disabled?: boolean;
  /**
   * When translating a variant that is not in the first loaded page, pass it so
   * the combobox can keep the current value visible until scroll loads it.
   */
  selectedVariant?: Pick<ProductVariantSibling, "id" | "name" | "sku"> | null;
  selectedMedia?: ProductContextMedia | null;
  onItemChange: (id: string, type: ProductContextSwitcherItemType) => void;
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

const variantOptionLabel = (
  variant: Pick<ProductVariantSibling, "id" | "name" | "sku">,
  intl: IntlShape,
): string =>
  intl.formatMessage(messages.productVariant, {
    name: variant.name || variant.sku || variant.id,
  });

const mediaOptionLabel = (media: ProductContextMedia, number: number, intl: IntlShape): string => {
  const alt = media.alt.trim();

  return alt
    ? intl.formatMessage(messages.productMediaWithAlt, { alt, number })
    : intl.formatMessage(messages.productMedia, { number });
};

/**
 * Downshift treats selectedItem by reference (itemToKey defaults to identity).
 * A new Option object on each options refresh rewrites the input back to the
 * selected label — keep the same reference while value/label are unchanged.
 */
const useStableOption = <T extends Option>(option: T | null): T | null => {
  const ref = useRef<T | null>(null);

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
  selectedMedia = null,
  disabled,
  onItemChange,
}: ProductContextSwitcherProps) => {
  const intl = useIntl();
  const mediaTranslationsEnabled = isMainSchema();
  const mainProductLabel = intl.formatMessage(messages.mainProduct);
  /**
   * `undefined` = show the committed translation target.
   * `null` = user cleared the field (Macaw onChange(null)); allow free typing.
   * Do not clear selection on every keystroke — that sets value→null and Downshift
   * resets inputValue to itemToString(null) (""), wiping the query.
   */
  const [selectionOverride, setSelectionOverride] = useState<
    ProductContextOption | null | undefined
  >(undefined);

  const { data: contextData } = useProductTranslationContextQuery({
    displayLoader: false,
    skip: !mediaTranslationsEnabled || !productId,
    variables: { id: productId },
  });
  const productTranslation = contextData?.translation;
  const media =
    mediaTranslationsEnabled && productTranslation?.__typename === "ProductTranslatableContent"
      ? (productTranslation.product?.media ?? [])
      : [];

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

  const mainProductOption = useMemo<ProductContextOption>(
    () => ({ label: mainProductLabel, value: productId, type: "main" }),
    [mainProductLabel, productId],
  );

  const options = useMemo(() => {
    const variantOptions: ProductContextOption[] = [];
    const seen = new Set<string>();

    if (offPageCurrent) {
      seen.add(offPageCurrent.id);
      variantOptions.push({
        label: variantOptionLabel(offPageCurrent, intl),
        value: offPageCurrent.id,
        type: "variant",
      });
    }

    for (const variant of variants) {
      if (seen.has(variant.id)) {
        continue;
      }

      seen.add(variant.id);
      variantOptions.push({
        label: variantOptionLabel(variant, intl),
        value: variant.id,
        type: "variant",
      });
    }

    const normalizedSearch = search.trim().toLocaleLowerCase();
    const mediaOptions = media
      .map<ProductContextOption>((mediaItem, index) => ({
        label: mediaOptionLabel(mediaItem, index + 1, intl),
        value: mediaItem.id,
        type: "media",
      }))
      .filter(
        option => !normalizedSearch || option.label.toLocaleLowerCase().includes(normalizedSearch),
      );

    // Keep Main Product at the top when not filtering by search.
    if (!search.trim()) {
      return [mainProductOption, ...variantOptions, ...mediaOptions];
    }

    return [...variantOptions, ...mediaOptions];
  }, [intl, mainProductOption, media, offPageCurrent, search, variants]);

  const selectedOption = useMemo<ProductContextOption | null>(() => {
    if (selectedId === productId) {
      return mainProductOption;
    }

    if (selectedVariant && selectedVariant.id === selectedId) {
      return {
        label: variantOptionLabel(selectedVariant, intl),
        value: selectedId,
        type: "variant",
      };
    }

    if (selectedMedia && selectedMedia.id === selectedId) {
      const mediaIndex = media.findIndex(mediaItem => mediaItem.id === selectedMedia.id);

      return {
        label: mediaOptionLabel(selectedMedia, mediaIndex >= 0 ? mediaIndex + 1 : 1, intl),
        value: selectedId,
        type: "media",
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
          type: "variant",
        }
      : null;
  }, [
    intl,
    mainProductOption,
    media,
    options,
    productId,
    selectedId,
    selectedMedia,
    selectedVariant,
  ]);

  const stableSelectedOption = useStableOption(selectedOption);
  const value = selectionOverride !== undefined ? selectionOverride : stableSelectedOption;

  const handleScrollEnd = useCallback(() => {
    if (hasNextPage && !loadingMore) {
      loadMore();
    }
  }, [hasNextPage, loadMore, loadingMore]);

  const handleChange = useCallback(
    (option: ProductContextOption | null) => {
      if (!option) {
        setSelectionOverride(null);

        return;
      }

      setSelectionOverride(undefined);
      setSearch("");
      onItemChange(option.value, option.type);
    },
    [onItemChange, setSearch],
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
