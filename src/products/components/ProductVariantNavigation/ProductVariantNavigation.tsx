import {
  borderHeight,
  pageViewportHeight,
  savebarHeight,
  topBarHeight,
} from "@dashboard/components/AppLayout/consts";
import { DashboardCard } from "@dashboard/components/Card";
import { InputWithPlaceholder } from "@dashboard/components/InputWithPlaceholder/InputWithPlaceholder";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  type ProductVariantSibling,
  useProductVariantSiblings,
} from "@dashboard/products/hooks/useProductVariantSiblings";
import { productVariantAddUrl, productVariantEditUrl } from "@dashboard/products/urls";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Button, Divider, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import {
  type ChangeEvent,
  type CSSProperties,
  Fragment,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import {
  type ProductVariantLayoutMode,
  useProductVariantLayout,
} from "../ProductVariantLayout/useProductVariantLayout";
import { ProductVariantEmptyItem } from "./components/ProductVariantEmptyItem";
import { VariantItem } from "./components/ProductVariantItem";
import { VariantSwitcherSummary } from "./components/VariantSwitcherSummary";
import { useLoadMoreOnScroll } from "./hooks/useLoadMoreOnScroll";
import { usePinnedActiveVariant } from "./hooks/usePinnedActiveVariant";
import { useVariantDrag, type VariantReorderMove } from "./hooks/useVariantDrag";
import { messages } from "./messages";
import styles from "./ProductVariantNavigation.module.css";
import { getVariantNeighbours } from "./variantNeighbours";

/**
 * Fill the sticky column to the Content scrollport (below TopNav, above
 * savebar). Sticky `top: 0` is the top of DetailPageLayout.Content — not the
 * viewport — so TopNav must be subtracted or the card runs under the savebar.
 * Using height (not only max-height) avoids empty white space under a short list.
 */
const cardStyle: CSSProperties = {
  height: `calc(${pageViewportHeight} - ${topBarHeight} - ${savebarHeight} - ${borderHeight} * 2)`,
  maxHeight: `calc(${pageViewportHeight} - ${topBarHeight} - ${savebarHeight} - ${borderHeight} * 2)`,
  overflow: "hidden",
};

/** A dragged variant moves up and down only, and stays within the list. */
const dragModifiers = [restrictToVerticalAxis, restrictToFirstScrollableAncestor];

/**
 * How many variants the stacked switcher loads on its own while looking for the open one.
 * Beyond that it would keep requesting pages and hold hundreds of rows for a variant the
 * merchant may never look up; the switcher then shows the count without a place.
 */
const OPEN_VARIANT_REACH = 300;

/** The picture that stands for a variant in the list: its first image, if it has one. */
const getVariantImage = (variant: ProductVariantSibling) =>
  variant.media?.find(mediaObj => mediaObj.type === "IMAGE");

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
  /**
   * Saves one move of a variant. Return a promise that resolves when the move was saved and
   * rejects when it wasn't, and the list keeps the dropped variant in place meanwhile.
   */
  onReorder: (move: VariantReorderMove) => void | Promise<unknown>;
  /** Overrides the layout the viewport asks for (stories, tests). */
  layout?: ProductVariantLayoutMode;
}

/**
 * The product's variants on the variant pages.
 * - `columns`: a full-height list beside the form.
 * - `stacked`: a switcher above the form — the open variant, its place, steps to the
 *   previous and next variant — that unfolds into the same list on demand.
 */
export const ProductVariantNavigation = ({
  current,
  selectionPending = false,
  currentVariant = null,
  defaultVariantId,
  productId,
  isCreate,
  onReorder,
  layout,
}: ProductVariantNavigationProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const viewportLayout = useProductVariantLayout();
  const isStacked = (layout ?? viewportLayout) === "stacked";
  const listId = useId();
  const [listOpen, setListOpen] = useState(false);
  const [listClosedFor, setListClosedFor] = useState(current);
  const {
    variants: loadedVariants,
    loadedCount,
    initialLoading,
    loadingMore,
    search,
    setSearch,
    hasNextPage,
    loadMore,
    refetch,
    reorder,
    canReorder,
    filtered,
    totalCount,
  } = useProductVariantSiblings({
    productId,
    currentVariant,
    skip: !productId,
  });

  // Opening a variant folds the stacked list, so the form that variant opens is in view.
  if (current !== listClosedFor) {
    setListClosedFor(current);
    setListOpen(false);
  }

  const {
    orderedVariants,
    items,
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useVariantDrag({
    variants: loadedVariants,
    onReorder,
    // The API has the new order by now; put the loaded pages in it without a refetch.
    onSaved: reorder,
    // A move whose answer never came may have been applied all the same, so the order in
    // the list can no longer be trusted: ask the API for the one it has. If that request
    // fails too, the list stays as it is.
    onFailed: () => {
      refetch().catch(() => undefined);
    },
  });
  // While a move is being saved the list shows the order that was asked for.
  const variants = orderedVariants;
  const draggedVariant = activeId
    ? (variants.find(variant => variant.id === activeId) ?? null)
    : null;

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
    // Stacked, the switcher above the list already shows the open variant. While the first
    // page loads there is no list yet to call the variant "not visible" in.
    enabled: !isStacked && !initialLoading,
  });

  const pinned = shouldPin ? pinnedVariant : null;
  const pinnedThumbnail = pinned ? getVariantImage(pinned) : undefined;

  const openVariant = current
    ? (variants.find(variant => variant.id === current) ?? currentVariant)
    : null;
  const { position, previousId, nextId, isLastLoaded } = getVariantNeighbours({
    variants,
    currentId: current,
    isFiltered: filtered,
  });

  useEffect(
    function clearSearchWhileStackedListIsClosed() {
      // Folded, the switcher describes the whole product (place, previous, next), which
      // search results can't tell — so a search lasts only while the list is open.
      if (isStacked && !listOpen && search) {
        setSearch("");
      }
    },
    [isStacked, listOpen, search, setSearch],
  );

  const searchFieldRef = useRef<HTMLInputElement>(null);
  const pageRequestRef = useRef<string | null>(null);

  // Stacked, the switcher can only tell the open variant's place, and step past it, from
  // the loaded pages. A deep link can open a variant far down the list, and stepping
  // forward reaches the end of a page — so the switcher loads towards what it needs.
  const openVariantLoaded = position !== null;
  const needsNextPage =
    isStacked &&
    !!current &&
    !filtered &&
    !initialLoading &&
    hasNextPage &&
    (openVariantLoaded ? isLastLoaded : variants.length < OPEN_VARIANT_REACH);

  useEffect(
    function loadPageTheSwitcherNeeds() {
      // Search results replace the list; what was asked of the old one no longer counts.
      if (filtered) {
        pageRequestRef.current = null;
      }

      if (!needsNextPage || loadingMore) {
        return;
      }

      // Once per variant and list length, so a request that fails is not sent in a loop.
      const request = `${current}:${variants.length}`;

      if (pageRequestRef.current === request) {
        return;
      }

      // Only a request that started counts: one refused because another was on its way
      // is tried again when that one is done.
      if (loadMore()) {
        pageRequestRef.current = request;
      }
    },
    [filtered, needsNextPage, loadingMore, current, variants.length, loadMore],
  );

  useLayoutEffect(
    function revealOpenVariantInStackedList() {
      if (!isStacked || !listOpen || initialLoading || !current || !openVariantLoaded) {
        return;
      }

      const container = scrollContainerRef.current;
      const row = container?.querySelector<HTMLElement>(
        `[data-variant-id="${CSS.escape(current)}"]`,
      );

      if (!container || !row) {
        return;
      }

      // Center the open variant, so the variants around it are the ones in reach.
      const rowTop = row.getBoundingClientRect().top - container.getBoundingClientRect().top;

      container.scrollTop += rowTop - (container.clientHeight - row.offsetHeight) / 2;
    },
    [isStacked, listOpen, initialLoading, current, openVariantLoaded, scrollContainerRef],
  );

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

  const handleListToggle = () => {
    // In the same update as the fold, so the switcher doesn't show one frame without its
    // place (the effect above would only clear the search after that frame).
    if (listOpen && search) {
      setSearch("");
    }

    setListOpen(!listOpen);
  };

  /** Stacked and folded, there is no list to build. */
  const listHidden = isStacked && !listOpen;

  const variantRows =
    initialLoading || listHidden
      ? null
      : renderCollection(variants, variant => {
          if (!variant) {
            return null;
          }

          const isDefault = variant.id === defaultVariantId;
          const isSelected = variant.id === current;
          // When pinned above, keep the in-list copy without the
          // active/pending indicator so only one is visible.
          const isPending = isSelected && selectionPending && !pinned;
          const isActive = isSelected && !selectionPending && !pinned;

          return (
            <Fragment key={variant.id}>
              {/* Always a sortable row, only not draggable while the list can't be
                reordered: swapping the row type would rebuild every row on each search. */}
              <VariantItem
                variant={variant}
                thumbnail={getVariantImage(variant)}
                isDefault={isDefault}
                isActive={isActive}
                isPending={isPending}
                productId={productId}
                draggable={canReorder && !selectionPending}
              />
              <Divider />
            </Fragment>
          );
        });

  const handleSearchClear = () => {
    setSearch("");
    // The button that was pressed is about to go; keep the keyboard in the search.
    searchFieldRef.current?.focus();
  };

  // Rows stay as they were while a search is on its way, so this only shows once a
  // search has come back empty.
  const noMatches = !initialLoading && variants.length === 0 && search.trim() !== "";

  const searchField = (
    <InputWithPlaceholder
      ref={searchFieldRef}
      size="small"
      value={search}
      onChange={handleSearchChange}
      onKeyDown={handleSearchKeyDown}
      placeholder={intl.formatMessage(messages.searchPlaceholder)}
      data-test-id="variant-siblings-search"
    />
  );

  const addVariantButton = isCreate ? null : (
    <Button
      variant="secondary"
      onClick={() => navigate(productVariantAddUrl(productId))}
      data-test-id="button-add-variant"
    >
      <FormattedMessage {...messages.addVariant} />
    </Button>
  );

  const list = listHidden ? null : (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      data-test-id="variant-siblings-scroll"
      className={clsx(styles.scrollContainer, isStacked && styles.scrollContainerStacked)}
    >
      {initialLoading ? (
        <Box data-test-id="variants-list">
          {[1, 2, 3].map(i => (
            <Fragment key={i}>
              {/* Same box as a real row (grip column, 40px image, name), so the rows
                  that replace these land in the same places. */}
              <Box
                display="flex"
                alignItems="center"
                gap={5}
                paddingX={2}
                paddingY={2}
                borderLeftStyle="solid"
                __borderColor="transparent"
                __borderLeftWidth={2}
              >
                <Box width={6} flexShrink="0" />
                <Skeleton __width={40} __height={40} borderRadius={2} flexShrink="0" />
                <Skeleton __width="50%" />
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
            modifiers={dragModifiers}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <Box data-test-id="variants-list">
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {variantRows}
              </SortableContext>
            </Box>
            {/* The dragged row's copy lives on the body, so the list's scroll area and
                the card around it don't clip it. */}
            {createPortal(
              <DragOverlay>
                {draggedVariant ? (
                  <VariantItem
                    variant={draggedVariant}
                    thumbnail={getVariantImage(draggedVariant)}
                    isDefault={draggedVariant.id === defaultVariantId}
                    isActive={false}
                    productId={productId}
                    draggable={false}
                    lifted
                  />
                ) : null}
              </DragOverlay>,
              document.body,
            )}
          </DndContext>

          {noMatches && (
            <Box
              role="status"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
              paddingX={6}
              paddingY={8}
              textAlign="center"
              data-test-id="variant-siblings-no-matches"
            >
              <Text size={3} color="default2">
                <FormattedMessage {...messages.noMatches} />
              </Text>
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={handleSearchClear}
                data-test-id="variant-siblings-clear-search"
              >
                <FormattedMessage {...messages.clearSearch} />
              </Button>
            </Box>
          )}

          {isCreate && (
            <ProductVariantEmptyItem>
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
  );

  if (isStacked) {
    const openVariantName = isCreate
      ? intl.formatMessage(messages.newVariant)
      : openVariant
        ? openVariant.name || openVariant.sku || ""
        : undefined;

    return (
      <div className={styles.switcher} data-test-id="variant-switcher">
        <VariantSwitcherSummary
          name={openVariantName}
          thumbnailUrl={openVariant ? getVariantImage(openVariant)?.url : undefined}
          isDefault={!!openVariant && openVariant.id === defaultVariantId}
          isPending={!!current && selectionPending}
          position={position}
          // While search results are shown the count is the number of matches.
          totalCount={filtered ? null : totalCount}
          expanded={listOpen}
          panelId={listId}
          onToggle={handleListToggle}
          onPrevious={previousId ? () => navigate(productVariantEditUrl(previousId)) : undefined}
          onNext={nextId ? () => navigate(productVariantEditUrl(nextId)) : undefined}
          hideSteps={isCreate}
        />
        {listOpen && (
          <div id={listId} className={styles.switcherList}>
            <div className={styles.switcherToolbar}>
              <div className={styles.switcherSearch}>{searchField}</div>
              {addVariantButton}
            </div>
            {list}
          </div>
        )}
      </div>
    );
  }

  return (
    <DashboardCard style={cardStyle}>
      <DashboardCard.Header paddingRight={0}>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.variants)}</DashboardCard.Title>
        {addVariantButton && <DashboardCard.Toolbar>{addVariantButton}</DashboardCard.Toolbar>}
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
            {searchField}
          </Box>
          {totalCount !== null ? (
            <Text size={2} color="default2" whiteSpace="nowrap">
              <FormattedMessage
                {...messages.siblingsCount}
                values={{
                  loaded: loadedCount,
                  total: totalCount,
                }}
              />
            </Text>
          ) : (
            // Holds the count's place while it loads, so the search field keeps its width.
            initialLoading && <Skeleton __width="48px" flexShrink="0" />
          )}
        </Box>
        <Divider />

        {pinned && (
          <Box data-test-id="variant-siblings-pinned-current" flexShrink="0">
            <VariantItem
              variant={pinned}
              thumbnail={pinnedThumbnail}
              isDefault={pinned.id === defaultVariantId}
              isActive={pinned.id === current && !selectionPending}
              isPending={pinned.id === current && selectionPending}
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
            <Divider />
          </Box>
        )}

        {list}
      </Box>
    </DashboardCard>
  );
};

ProductVariantNavigation.displayName = "ProductVariantNavigation";
