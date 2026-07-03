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
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type AssignContainerDialogProps } from "../AssignContainerDialog";
import { AssignPickerListEmptyStateRow } from "../AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "../AssignPickerListLoading/AssignPickerListLoading";
import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";
import { useStyles } from "./styles";
import {
  getCompositeLabel,
  handleProductAssign,
  handleVariantAssign,
  hasAllVariantsSelected,
  isVariantSelected,
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
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const { combinedFilters, clearFilters } = useModalProductFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    skipFetchOnOpen,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

  const [variants, setVariants] = useState<VariantWithProductLabel[]>([]);
  const productChoices = products?.filter(product => product?.variants?.length > 0) || [];
  const displayedProductChoices = useStalePickerList(productChoices, loading, open);
  const selectedVariantsToProductsMap = displayedProductChoices.map(product =>
    product.variants.map(variant => isVariantSelected(variant, variants)),
  );
  const productsWithAllVariantsSelected = displayedProductChoices.map(product =>
    hasAllVariantsSelected(product.variants, variants),
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

  useModalDialogOpen(open, {
    onOpen: () => {
      resetQuery();
      clearFilters();
      setVariants([]);
    },
    onClose: handleClose,
  });

  // Already-assigned variants are filtered out of the list, so the initial
  // selection is always empty and any selection counts as a change.
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
            dataLength={variants?.length ?? 0}
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
                    (product, productIndex) => (
                      <Fragment key={product ? product.id : "skeleton"}>
                        <TableRowLink>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={productsWithAllVariantsSelected[productIndex]}
                              disabled={loading}
                              onChange={() =>
                                handleProductAssign(
                                  product,
                                  productIndex,
                                  productsWithAllVariantsSelected,
                                  variants,
                                  setVariants,
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
                        {maybe(() => product.variants, []).map((variant, variantIndex) => (
                          <TableRowLink key={variant.id} data-test-id="assign-variant-table-row">
                            <TableCell />
                            <TableCell className={classes.colVariantCheckbox}>
                              <Checkbox
                                className={classes.variantCheckbox}
                                checked={selectedVariantsToProductsMap[productIndex][variantIndex]}
                                disabled={loading}
                                onChange={() =>
                                  handleVariantAssign(
                                    variant,
                                    product,
                                    variantIndex,
                                    productIndex,
                                    variants,
                                    selectedVariantsToProductsMap,
                                    setVariants,
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
                        ))}
                      </Fragment>
                    ),
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
