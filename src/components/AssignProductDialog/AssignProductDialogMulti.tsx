// @ts-strict-ignore
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
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignPickerListEmptyStateRow } from "../AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "../AssignPickerListLoading/AssignPickerListLoading";
import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { useModalProductFilterContext } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { type Products, type SelectedChannel } from "./types";
import {
  getSelectedIdsFromDict,
  hasMultiSelectionChanged,
  isProductAvailableInVoucherChannels,
} from "./utils";

interface AssignProductDialogMultiProps extends FetchMoreProps {
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
  labels?: {
    confirmBtn?: string;
  };
  open: boolean;
  skipFetchOnOpen?: boolean;
}

const scrollableTargetId = "assignProductScrollableDialog";

export const AssignProductDialogMulti = (props: AssignProductDialogMultiProps) => {
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
    selectedIds,
    labels,
    open,
    skipFetchOnOpen = false,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [productsDict, setProductsDict] = useState<Record<string, boolean>>({});
  const [initialSelection, setInitialSelection] = useState<Record<string, boolean>>({});
  const { combinedFilters, clearFilters } = useModalProductFilterContext();
  const selectedIdsRef = useRef(selectedIds);

  selectedIdsRef.current = selectedIds;

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    skipFetchOnOpen,
    onFetch: (filters, query) => onFilterChange?.(filters.where, filters.channel, query),
  });

  // Keep selected product data to send them back when submitting
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

  const handleChange = productId => {
    const productData = products.find(product => product.id === productId);

    if (productData) {
      productsData.current = [...productsData.current, productData];
    }

    setProductsDict(prev => ({
      ...prev,
      [productId]: prev[productId] ? false : true,
    }));
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

                      const isSelected = productsDict[product.id] || false;
                      const isProductAvailable = isProductAvailableInVoucherChannels(
                        product.channelListings,
                        selectedChannels,
                      );

                      return (
                        <TableRowLink key={product.id} data-test-id="assign-product-table-row">
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              disabled={!isProductAvailable}
                              onChange={() => handleChange(product.id)}
                            />
                          </TableCell>
                          <TableCellAvatar
                            className={classes.avatar}
                            thumbnail={maybe(() => product.thumbnail.url)}
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
            {selectedCount > 0
              ? intl.formatMessage(messages.assignCountedButton, {
                  label:
                    labels?.confirmBtn ?? intl.formatMessage(messages.assignProductDialogButton),
                  count: selectedCount,
                })
              : (labels?.confirmBtn ?? (
                  <FormattedMessage {...messages.assignProductDialogButton} />
                ))}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
