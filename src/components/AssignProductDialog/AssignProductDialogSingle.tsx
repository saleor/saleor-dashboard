import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type ProductWhereInput } from "@dashboard/graphql";
import { useAssignPickerListDisplayState } from "@dashboard/hooks/useAssignPickerListDisplayState";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { useStalePickerList } from "@dashboard/hooks/useStalePickerList";
import { maybe, renderCollection } from "@dashboard/misc";
import { type Container, type FetchMoreProps } from "@dashboard/types";
import { Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignPickerListEmptyStateRow } from "../AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "../AssignPickerListLoading/AssignPickerListLoading";
import BackButton from "../BackButton";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { type Products, type SelectedChannel } from "./types";
import { hasSingleSelectionChanged, isProductAvailableInVoucherChannels } from "./utils";

interface AssignProductDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedId?: string;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  onClose: () => void;
  labels?: {
    confirmBtn?: string;
  };
  open: boolean;
  skipFetchOnOpen?: boolean;
}

const scrollableTargetId = "assignProductScrollableDialog";

export const AssignProductDialogSingle = (props: AssignProductDialogSingleProps) => {
  const {
    confirmButtonState,
    selectedChannels,
    productUnavailableText,
    hasMore,
    loading,
    products,
    onClose,
    onFilterChange,
    onFetchMore,
    onSubmit,
    selectedId,
    labels,
    open,
    skipFetchOnOpen = false,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [initialSelection, setInitialSelection] = useState("");
  const { combinedFilters, clearFilters } = useModalProductFilterContext();
  const selectedIdRef = useRef(selectedId);

  selectedIdRef.current = selectedId;

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    skipFetchOnOpen,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

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
      setSelectedProductId("");
      setInitialSelection("");

      return;
    }

    const nextInitialSelection = selectedIdRef.current ?? "";

    setInitialSelection(nextInitialSelection);
    setSelectedProductId(nextInitialSelection);
  }, [open]);

  const hasSelectionChanged = useMemo(
    () => hasSingleSelectionChanged(selectedProductId, initialSelection),
    [selectedProductId, initialSelection],
  );

  useModalDialogOpen(open, {
    onOpen: resetDialogState,
    onClose: resetDialogState,
  });

  const handleSubmit = () => {
    if (selectedProductId) {
      const selectedProduct = products.find(product => product.id === selectedProductId);

      if (selectedProduct) {
        onSubmit([
          {
            ...selectedProduct,
            id: selectedProduct.id,
            name: selectedProduct.name,
          },
        ]);

        return;
      }
    }

    onSubmit([]);
  };

  const handleChange = (productId: string) => {
    setSelectedProductId(productId === selectedProductId ? "" : productId);
  };

  const displayedProducts = useStalePickerList(products, loading, open);
  const { showEmptyState, showListLoading } = useAssignPickerListDisplayState(
    loading,
    displayedProducts.length,
  );

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader
          toolbar={
            <>
              <TextField
                data-test-id="product-search-input"
                name="query"
                value={query}
                onChange={onQueryChange}
                label={intl.formatMessage(messages.assignProductDialogSearch)}
                placeholder={intl.formatMessage(messages.assignProductDialogContent)}
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
            dataLength={displayedProducts.length}
            next={onFetchMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            scrollableTarget={scrollableTargetId}
          >
            <ResponsiveTable bleed fillHeight key="table">
              <TableBody data-test-id="products-list">
                {showListLoading ? (
                  <AssignPickerListLoadingRow colSpan={3} />
                ) : (
                  renderCollection(
                    displayedProducts,
                    product => {
                      if (!product) {
                        return null;
                      }

                      const isSelected = selectedProductId === product.id;
                      const isProductAvailable = isProductAvailableInVoucherChannels(
                        product.channelListings ?? [],
                        selectedChannels,
                      );

                      return (
                        <TableRowLink
                          key={product.id}
                          data-test-id="assign-product-table-row"
                          onClick={() => (!isProductAvailable ? null : handleChange(product.id))}
                        >
                          <TableCell padding="checkbox">
                            <Radio
                              checked={isSelected}
                              disabled={!isProductAvailable}
                              onChange={() => handleChange(product.id)}
                              value={product.id}
                              name="product-selection"
                            />
                          </TableCell>
                          <TableCellAvatar
                            className={classes.avatar}
                            thumbnail={maybe(() => product.thumbnail?.url)}
                            style={{
                              opacity: !isProductAvailable ? 0.5 : 1,
                            }}
                          />
                          <TableCell className={classes.wideCell}>
                            {product.name}
                            {!isProductAvailable && productUnavailableText && (
                              <Text display="block" size={1} color="default2">
                                {productUnavailableText}
                              </Text>
                            )}
                          </TableCell>
                        </TableRowLink>
                      );
                    },
                    () =>
                      showEmptyState && (
                        <AssignPickerListEmptyStateRow colSpan={3}>
                          {intl.formatMessage(messages.noProductsFound)}
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
            {labels?.confirmBtn ?? <FormattedMessage {...messages.assignProductDialogButton} />}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
