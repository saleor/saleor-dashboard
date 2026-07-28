// @ts-strict-ignore
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import Money from "@dashboard/components/Money";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type ProductWhereInput, type SearchProductsQuery } from "@dashboard/graphql";
import { useAssignPickerListDisplayState } from "@dashboard/hooks/useAssignPickerListDisplayState";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { useStalePickerList } from "@dashboard/hooks/useStalePickerList";
import { maybe, renderCollection } from "@dashboard/misc";
import { type Container, type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type AssignContainerDialogProps } from "../AssignContainerDialog";
import { AssignPickerListEmptyStateRow } from "../AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "../AssignPickerListLoading/AssignPickerListLoading";
import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { AssignVariantLoadMoreRow } from "./AssignVariantLoadMoreRow";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { useAssignVariantDialogProducts } from "./useAssignVariantDialogProducts";
import {
  getCompositeLabel,
  handleProductAssign,
  handleVariantAssign,
  hasAllVariantsSelected,
  isVariantSelected,
  isVariantsListTruncated,
  toAssignableProducts,
  type VariantWithProductLabel,
} from "./utils";

interface AssignVariantDialogMultiProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  open: boolean;
  skipFetchOnOpen?: boolean;
  /** Variant ids already assigned when the dialog opened — shown checked and disabled. */
  selectedIds?: string[];
}

const scrollableTargetId = "assignVariantScrollableDialog";

export const AssignVariantDialogMulti = (props: AssignVariantDialogMultiProps) => {
  const {
    confirmButtonState,
    labels,
    hasMore,
    loading,
    products,
    onClose,
    onFilterChange,
    onFetchMore,
    onSubmit,
    open,
    skipFetchOnOpen = false,
    selectedIds,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const selectedIdsRef = useRef(selectedIds);

  selectedIdsRef.current = selectedIds;

  const { combinedFilters, clearFilters } = useModalProductFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    skipFetchOnOpen,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

  const [variants, setVariants] = useState<VariantWithProductLabel[]>([]);
  // Attribute dialog mounts with open already true, so useModalDialogOpen's onOpen
  // never runs — initialize (and sync on open) from selectedIds directly.
  const [lockedVariantIds, setLockedVariantIds] = useState<ReadonlySet<string>>(
    () => new Set(selectedIds ?? []),
  );
  const assignableFromSearch = useMemo(() => toAssignableProducts(products), [products]);
  const {
    products: assignableProducts,
    loadMoreVariants,
    loadingProductIds,
  } = useAssignVariantDialogProducts({
    products: assignableFromSearch,
    searchQuery: query,
    channel: combinedFilters.channel,
    open,
  });
  const productChoices = assignableProducts.filter(product => product.variants.length > 0);
  const displayedProductChoices = useStalePickerList(productChoices, loading, open);
  const selectedVariantsToProductsMap = displayedProductChoices.map(product =>
    product.variants.map(
      variant => lockedVariantIds.has(variant.id) || isVariantSelected(variant, variants),
    ),
  );
  const productsWithAllVariantsSelected = displayedProductChoices.map(product =>
    hasAllVariantsSelected(product.variants, variants, lockedVariantIds),
  );
  const handleSubmit = () =>
    onSubmit(
      variants.map(variant => ({
        name: getCompositeLabel(variant),
        id: variant.id,
        ...variant,
      })),
    );

  const handleClose = () => {
    resetQuery();
    clearFilters();
    onClose();
  };

  useEffect(
    function syncLockedVariantsWhenOpened() {
      if (!open) {
        return;
      }

      setLockedVariantIds(new Set(selectedIdsRef.current ?? []));
      setVariants([]);
    },
    [open],
  );

  useModalDialogOpen(open, {
    onOpen: () => {
      resetQuery();
      clearFilters();
    },
    onClose: handleClose,
  });

  // Submit only newly selected variants; locked ones stay assigned outside the dialog.
  const selectedCount = variants.length;
  const hasSelectionChanged = selectedCount > 0;

  const { showEmptyState, showListLoading } = useAssignPickerListDisplayState(
    loading,
    displayedProductChoices.length,
  );

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader
          toolbar={
            <>
              <TextField
                name="query"
                value={query}
                onChange={onQueryChange}
                label={intl.formatMessage(messages.assignVariantDialogSearch)}
                placeholder={intl.formatMessage(messages.assignVariantDialogContent)}
                fullWidth
                InputProps={{
                  autoComplete: "off",
                  endAdornment: loading && <SaleorThrobber size={16} />,
                }}
              />

              <ModalFilters />
            </>
          }
        >
          <FormattedMessage {...messages.assignVariantDialogHeader} />
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill id={scrollableTargetId}>
          <InfiniteScroll
            flush
            dataLength={displayedProductChoices.reduce(
              (acc, product) => acc + (product.variants?.length || 0),
              0,
            )}
            next={onFetchMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            scrollableTarget={scrollableTargetId}
          >
            <ResponsiveTable bleed fillHeight key="table">
              <TableBody>
                {showListLoading ? (
                  <AssignPickerListLoadingRow colSpan={4} />
                ) : (
                  renderCollection(
                    displayedProductChoices,
                    (product, productIndex) => {
                      const hasAssignableVariants =
                        !!product &&
                        product.variants.some(variant => !lockedVariantIds.has(variant.id));

                      return (
                        <Fragment key={product ? product.id : "skeleton"}>
                          <TableRowLink>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={
                                  !!product &&
                                  !isVariantsListTruncated(product) &&
                                  productsWithAllVariantsSelected[productIndex]
                                }
                                disabled={
                                  loading ||
                                  !product ||
                                  isVariantsListTruncated(product) ||
                                  !hasAssignableVariants
                                }
                                onChange={() =>
                                  product &&
                                  handleProductAssign(
                                    product,
                                    productIndex,
                                    productsWithAllVariantsSelected,
                                    variants,
                                    setVariants,
                                    lockedVariantIds,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCellAvatar
                              className={classes.avatar}
                              thumbnail={maybe(() => product.thumbnail.url)}
                            />
                            <TableCell colSpan={2}>{maybe(() => product.name)}</TableCell>
                          </TableRowLink>
                          {maybe(() => product.variants, []).map((variant, variantIndex) => {
                            const isLocked = lockedVariantIds.has(variant.id);

                            return (
                              <TableRowLink
                                key={variant.id}
                                data-test-id="assign-variant-table-row"
                              >
                                <TableCell />
                                <TableCell className={classes.colVariantCheckbox}>
                                  <Checkbox
                                    className={classes.variantCheckbox}
                                    checked={
                                      selectedVariantsToProductsMap[productIndex][variantIndex]
                                    }
                                    disabled={loading || isLocked}
                                    onChange={() =>
                                      handleVariantAssign(
                                        variant,
                                        product,
                                        variantIndex,
                                        productIndex,
                                        variants,
                                        selectedVariantsToProductsMap,
                                        setVariants,
                                        lockedVariantIds,
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <div>{variant.name}</div>
                                  <div className={classes.grayText}>
                                    <FormattedMessage
                                      {...messages.assignVariantDialogSKU}
                                      values={{
                                        sku: variant.sku,
                                      }}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className={classes.textRight}>
                                  {variant?.channelListings[0]?.price && (
                                    <Money money={variant.channelListings[0].price} />
                                  )}
                                </TableCell>
                              </TableRowLink>
                            );
                          })}
                          <AssignVariantLoadMoreRow
                            product={product}
                            loading={loading}
                            loadingProduct={Boolean(product && loadingProductIds.has(product.id))}
                            onLoadMore={loadMoreVariants}
                          />
                        </Fragment>
                      );
                    },
                    () =>
                      showEmptyState && (
                        <AssignPickerListEmptyStateRow colSpan={4}>
                          {query
                            ? intl.formatMessage(messages.noProductsInQuery)
                            : intl.formatMessage(messages.noProductsInChannel)}
                        </AssignPickerListEmptyStateRow>
                      ),
                  )
                )}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={!hasSelectionChanged}
            transitionState={confirmButtonState}
            type="submit"
            onClick={handleSubmit}
          >
            {selectedCount > 0
              ? intl.formatMessage(messages.assignCountedButton, {
                  label:
                    labels?.confirmBtn ?? intl.formatMessage(messages.assignVariantDialogButton),
                  count: selectedCount,
                })
              : (labels?.confirmBtn ?? (
                  <FormattedMessage {...messages.assignVariantDialogButton} />
                ))}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
