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
import { type ChangeEvent, Fragment, type KeyboardEvent, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { ProductVariantEmptyItem } from "./components/ProductVariantEmptyItem";
import { VariantItem } from "./components/ProductVariantItem";
import { useVariantDrag, type VariantReorderMove } from "./hooks/useVariantDrag";
import { messages } from "./messages";

interface ProductVariantNavigationProps {
  current?: string;
  /** Used to pin the open variant when it isn't in the loaded sibling pages. */
  currentVariant?: ProductVariantSibling | null;
  defaultVariantId?: string;
  fallbackThumbnail: string;
  productId: string;
  isCreate?: boolean;
  onReorder: (move: VariantReorderMove) => void;
}

export const ProductVariantNavigation = ({
  current,
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
    loading,
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

  const hasVariants = variants.length > 0;

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

  return (
    <DashboardCard>
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

      <Box
        display="flex"
        alignItems="center"
        gap={3}
        paddingLeft={6}
        paddingBottom={0}
        width="100%"
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

      <Box __maxHeight="calc(100vh - 280px)" overflowY="auto" paddingBottom={4}>
        {loading ? (
          <Box data-test-id="variants-list">
            <Divider />
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={canReorder ? handleDragEnd : undefined}
            >
              <Box data-test-id="variants-list">
                {hasVariants && <Divider />}
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  {renderCollection(variants, variant => {
                    if (!variant) {
                      return null;
                    }

                    const isDefault = variant.id === defaultVariantId;
                    const isActive = variant.id === current;
                    const thumbnail = variant.media?.filter(
                      mediaObj => mediaObj.type === "IMAGE",
                    )[0];

                    return (
                      <Fragment key={variant.id}>
                        <VariantItem
                          variant={variant}
                          thumbnail={thumbnail}
                          isDefault={isDefault}
                          isActive={isActive}
                          productId={productId}
                          draggable={canReorder && !isSaving}
                        />
                        <Divider height={0} />
                      </Fragment>
                    );
                  })}
                </SortableContext>
              </Box>
            </DndContext>

            {isCreate && (
              <ProductVariantEmptyItem hasVariants={hasVariants}>
                <Text>
                  <FormattedMessage {...messages.newVariant} />
                </Text>
              </ProductVariantEmptyItem>
            )}

            {hasNextPage && (
              <Box paddingX={6} paddingTop={2}>
                <Button
                  variant="secondary"
                  width="100%"
                  onClick={loadMore}
                  disabled={loadingMore}
                  data-test-id="variant-siblings-load-more"
                >
                  <FormattedMessage {...(loadingMore ? messages.loadingMore : messages.loadMore)} />
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </DashboardCard>
  );
};

ProductVariantNavigation.displayName = "ProductVariantNavigation";
