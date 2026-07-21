import { borderHeight, savebarHeight, topBarHeight } from "@dashboard/components/AppLayout/consts";
import { DashboardCard } from "@dashboard/components/Card";
import { Divider } from "@dashboard/components/Divider";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  type ProductVariantSibling,
  useProductVariantSiblings,
} from "@dashboard/products/hooks/useProductVariantSiblings";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Button, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
import {
  type ChangeEvent,
  type CSSProperties,
  Fragment,
  type KeyboardEvent,
  useCallback,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { ProductVariantEmptyItem } from "./components/ProductVariantEmptyItem";
import { VariantItem } from "./components/ProductVariantItem";
import { useLoadMoreOnScroll } from "./hooks/useLoadMoreOnScroll";
import { usePinnedActiveVariant } from "./hooks/usePinnedActiveVariant";
import { useVariantDrag, type VariantReorderMove } from "./hooks/useVariantDrag";
import { messages } from "./messages";
import styles from "./ProductVariantNavigation.module.css";

/**
 * Fill the sticky column to the Content scrollport (below TopNav, above
 * savebar). Sticky `top: 0` is the top of DetailPageLayout.Content — not the
 * viewport — so TopNav must be subtracted or the card runs under the savebar.
 * Using height (not only max-height) avoids empty white space under a short list.
 */
const cardStyle: CSSProperties = {
  height: `calc(100vh - ${topBarHeight} - ${savebarHeight} - ${borderHeight} * 2)`,
  maxHeight: `calc(100vh - ${topBarHeight} - ${savebarHeight} - ${borderHeight} * 2)`,
  overflow: "hidden",
};

interface ProductVariantNavigationProps {
  current?: string;
  /** True while details for `current` are still loading. */
  selectionPending?: boolean;
  /** Used when the open variant is outside the loaded sibling pages. */
  currentVariant?: ProductVariantSibling | null;
  defaultVariantId?: string;
  fallbackThumbnail: string;
  productId: string;
  isCreate?: boolean;
  onReorder: (move: VariantReorderMove) => void;
}

export const ProductVariantNavigation = ({
  current,
  selectionPending = false,
  currentVariant = null,
  defaultVariantId,
  productId,
  isCreate,
  onReorder,
}: ProductVariantNavigationProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const {
    variants,
    loadedCount,
    initialLoading,
    loadingMore,
    search,
    setSearch,
    hasNextPage,
    loadMore,
    canReorder,
    totalCount,
  } = useProductVariantSiblings({
    productId,
    currentVariant,
    skip: !productId,
  });

  const handleReorder = useCallback(
    (move: VariantReorderMove) => {
      if (!canReorder) {
        return;
      }

      onReorder(move);
    },
    [canReorder, onReorder],
  );

  const { items, sensors, isSaving, handleDragEnd } = useVariantDrag({
    variants,
    onReorder: handleReorder,
  });

  const { scrollContainerRef, handleScroll } = useLoadMoreOnScroll({
    hasNextPage,
    loadingMore,
    onLoadMore: loadMore,
  });

  const { shouldPin, pinnedVariant } = usePinnedActiveVariant({
    currentId: current,
    currentVariant,
    variants,
    scrollContainerRef,
  });

  const hasVariants = variants.length > 0;
  const pinnedThumbnail = pinnedVariant?.media?.filter(mediaObj => mediaObj.type === "IMAGE")[0];

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [setSearch],
  );

  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Escape" || !search) {
        return;
      }

      event.preventDefault();
      setSearch("");
      event.currentTarget.blur();
    },
    [search, setSearch],
  );

  const variantRows = initialLoading
    ? null
    : renderCollection(variants, variant => {
        if (!variant) {
          return null;
        }

        const isDefault = variant.id === defaultVariantId;
        const isSelected = variant.id === current;
        // When pinned above, keep the in-list copy without the
        // active/pending indicator so only one is visible.
        const isPending = isSelected && selectionPending && !shouldPin;
        const isActive = isSelected && !selectionPending && !shouldPin;
        const thumbnail = variant.media?.filter(mediaObj => mediaObj.type === "IMAGE")[0];

        return (
          <Fragment key={variant.id}>
            <VariantItem
              variant={variant}
              thumbnail={thumbnail}
              isDefault={isDefault}
              isActive={isActive}
              isPending={isPending}
              productId={productId}
              sortable={canReorder}
              draggable={canReorder && !isSaving && !selectionPending}
            />
            <Divider height={0} />
          </Fragment>
        );
      });

  return (
    <DashboardCard style={cardStyle}>
      <DashboardCard.Header paddingRight={0}>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.variants)}</DashboardCard.Title>
        {!isCreate && (
          <DashboardCard.Toolbar>
            <Button
              variant="secondary"
              onClick={() => navigate(productVariantAddUrl(productId))}
              data-test-id="button-add-variant"
            >
              <FormattedMessage {...messages.addVariant} />
            </Button>
          </DashboardCard.Toolbar>
        )}
      </DashboardCard.Header>

      {/* Fills remaining card height under the header; scroll list flexes inside. */}
      <Box display="flex" flexDirection="column" __minHeight={0} flexGrow="1">
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          paddingLeft={6}
          paddingBottom={2}
          width="100%"
          flexShrink="0"
        >
          <Box flexGrow="1" __minWidth={0}>
            <Input
              size="small"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder={intl.formatMessage(messages.searchPlaceholder)}
              data-test-id="variant-siblings-search"
            />
          </Box>
          {totalCount !== null && (
            <Text size={2} color="default2" whiteSpace="nowrap">
              <FormattedMessage
                {...messages.siblingsCount}
                values={{
                  loaded: loadedCount,
                  total: totalCount,
                }}
              />
            </Text>
          )}
        </Box>
        <Divider height={0} />

        {shouldPin && pinnedVariant && (
          <Box data-test-id="variant-siblings-pinned-current" flexShrink="0">
            <VariantItem
              variant={pinnedVariant}
              thumbnail={pinnedThumbnail}
              isDefault={pinnedVariant.id === defaultVariantId}
              isActive={pinnedVariant.id === current && !selectionPending}
              isPending={pinnedVariant.id === current && selectionPending}
              productId={productId}
              draggable={false}
              sortable={false}
              showDragHandle={false}
              caption={
                <Text display="block" size={2} color="default2">
                  <FormattedMessage {...messages.pinnedActiveHint} />
                </Text>
              }
            />
            <Divider height={0} />
          </Box>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          data-test-id="variant-siblings-scroll"
          className={styles.scrollContainer}
        >
          {initialLoading ? (
            <Box data-test-id="variants-list">
              {[1, 2, 3].map(i => (
                <Fragment key={i}>
                  <Box display="flex" alignItems="center" gap={4} paddingX={6} paddingY={4}>
                    <Skeleton __width={48} __height={48} borderRadius={2} />
                    <Skeleton __width="60%" />
                  </Box>
                  <Divider />
                </Fragment>
              ))}
            </Box>
          ) : (
            <>
              {canReorder ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <Box data-test-id="variants-list">
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                      {variantRows}
                    </SortableContext>
                  </Box>
                </DndContext>
              ) : (
                <Box data-test-id="variants-list">{variantRows}</Box>
              )}

              {isCreate && (
                <ProductVariantEmptyItem hasVariants={hasVariants}>
                  <Text>
                    <FormattedMessage {...messages.newVariant} />
                  </Text>
                </ProductVariantEmptyItem>
              )}

              {loadingMore && (
                <Box paddingX={6} paddingY={3} display="flex" justifyContent="center">
                  <Text size={2} color="default2">
                    <FormattedMessage {...messages.loadingMore} />
                  </Text>
                </Box>
              )}
            </>
          )}
        </div>
      </Box>
    </DashboardCard>
  );
};

ProductVariantNavigation.displayName = "ProductVariantNavigation";
