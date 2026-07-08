import { AssignPickerListEmptyStateRow } from "@dashboard/components/AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "@dashboard/components/AssignPickerListLoading/AssignPickerListLoading";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type OrderFulfillLineFragment, type WarehouseFragment } from "@dashboard/graphql";
import { useAssignPickerListDisplayState } from "@dashboard/hooks/useAssignPickerListDisplayState";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { useStalePickerList } from "@dashboard/hooks/useStalePickerList";
import { buttonMessages } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { getLineAvailableQuantityInWarehouse } from "@dashboard/orders/utils/data";
import useWarehouseSearch from "@dashboard/searches/useWarehouseSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { changeWarehouseDialogMessages as messages } from "./messages";

const EMPTY_SEARCH_FILTERS = {};
const scrollableTargetId = "order-change-warehouse-scroll";

interface OrderChangeWarehouseDialogProps {
  open: boolean;
  line: OrderFulfillLineFragment;
  currentWarehouseId: string;
  onConfirm: (warehouse: WarehouseFragment) => void;
  onClose: () => void;
}

export const OrderChangeWarehouseDialog = ({
  open,
  line,
  currentWarehouseId,
  onConfirm,
  onClose,
}: OrderChangeWarehouseDialogProps) => {
  const intl = useIntl();
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseFragment | null>(null);
  const [initialSelectionId, setInitialSelectionId] = useState<string | null>(null);
  const currentWarehouseIdRef = useRef(currentWarehouseId);

  currentWarehouseIdRef.current = currentWarehouseId;

  const {
    result: warehousesOpts,
    loadMore,
    search,
  } = useWarehouseSearch({
    variables: {
      after: null,
      channnelsId: null,
      first: 20,
      query: "",
    },
    skip: !open,
  });

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: EMPTY_SEARCH_FILTERS,
    open,
    onFetch: (_filters, searchQuery) => search(searchQuery),
  });

  const resetDialogState = useCallback(() => {
    resetQuery();
    setSelectedWarehouse(null);
    setInitialSelectionId(null);
  }, [resetQuery]);

  const syncOpenState = useCallback(() => {
    resetQuery();
    setInitialSelectionId(currentWarehouseIdRef.current ?? null);
    setSelectedWarehouse(null);
  }, [resetQuery]);

  useModalDialogOpen(open, {
    onOpen: syncOpenState,
    onClose: resetDialogState,
  });

  const loading = warehousesOpts.loading;
  const warehouses = mapEdgesToItems(warehousesOpts?.data?.search);
  const displayedWarehouses = useStalePickerList(warehouses, loading, open);
  const hasMore = warehousesOpts?.data?.search?.pageInfo?.hasNextPage ?? false;
  const { showEmptyState, showListLoading } = useAssignPickerListDisplayState(
    loading,
    displayedWarehouses.length,
  );

  useEffect(
    function hydrateSelectedWarehouse() {
      if (!open || selectedWarehouse || !initialSelectionId) {
        return;
      }

      const match = displayedWarehouses.find(warehouse => warehouse.id === initialSelectionId);

      if (match) {
        setSelectedWarehouse(match);
      }
    },
    [displayedWarehouses, initialSelectionId, open, selectedWarehouse],
  );

  const hasSelectionChanged = useMemo(
    () => selectedWarehouse?.id !== initialSelectionId,
    [initialSelectionId, selectedWarehouse?.id],
  );

  const handleClose = () => {
    resetDialogState();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedWarehouse) {
      return;
    }

    onConfirm(selectedWarehouse);
    handleClose();
  };

  const handleChange = (warehouse: WarehouseFragment) => {
    setSelectedWarehouse(warehouse);
  };

  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader
          description={
            <FormattedMessage
              {...messages.dialogDescription}
              values={{
                productName: line.productName,
              }}
            />
          }
          toolbar={
            <TextField
              data-test-id="warehouse-search-input"
              name="query"
              value={query}
              onChange={onQueryChange}
              label={intl.formatMessage(messages.searchFieldPlaceholder)}
              placeholder={intl.formatMessage(messages.searchFieldPlaceholder)}
              fullWidth
              InputProps={{
                autoComplete: "off",
                endAdornment: loading && <SaleorThrobber size={16} />,
              }}
            />
          }
        >
          <FormattedMessage {...messages.dialogTitle} />
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill id={scrollableTargetId}>
          <InfiniteScroll
            flush
            dataLength={displayedWarehouses.length}
            next={loadMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            scrollableTarget={scrollableTargetId}
          >
            <ResponsiveTable bleed fillHeight>
              <TableBody data-test-id="warehouses-list">
                {showListLoading ? (
                  <AssignPickerListLoadingRow colSpan={2} />
                ) : (
                  renderCollection(
                    displayedWarehouses,
                    warehouse => {
                      if (!warehouse) {
                        return null;
                      }

                      const isSelected = selectedWarehouse?.id === warehouse.id;
                      const lineQuantityInWarehouse = getLineAvailableQuantityInWarehouse(
                        line,
                        warehouse,
                      );
                      const isCurrentWarehouse = currentWarehouseId === warehouse.id;

                      return (
                        <TableRowLink
                          key={warehouse.id}
                          data-test-id="change-warehouse-table-row"
                          onClick={() => handleChange(warehouse)}
                        >
                          <TableCell padding="checkbox">
                            <Radio
                              checked={isSelected}
                              onChange={() => handleChange(warehouse)}
                              value={warehouse.id}
                              name="warehouse-selection"
                            />
                          </TableCell>
                          <TableCell style={{ width: "100%" }}>
                            {warehouse.name}
                            <Text display="block" size={1} color="default2">
                              <FormattedMessage
                                {...messages.productAvailability}
                                values={{
                                  productCount: lineQuantityInWarehouse,
                                }}
                              />
                            </Text>
                            {isCurrentWarehouse ? (
                              <Text display="block" size={1} color="default2">
                                <FormattedMessage {...messages.currentSelection} />
                              </Text>
                            ) : null}
                          </TableCell>
                        </TableRowLink>
                      );
                    },
                    () =>
                      showEmptyState && (
                        <AssignPickerListEmptyStateRow colSpan={2}>
                          {intl.formatMessage(messages.noWarehousesFound)}
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
            onClick={handleSubmit}
            transitionState="default"
          >
            <FormattedMessage {...buttonMessages.select} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderChangeWarehouseDialog.displayName = "OrderChangeWarehouseDialog";
