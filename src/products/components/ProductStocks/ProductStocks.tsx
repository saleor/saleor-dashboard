// @ts-strict-ignore
import { type ChannelData } from "@dashboard/channels/utils";
import { AssignWarehouseDialog } from "@dashboard/components/AssignWarehouseDialog/AssignWarehouseDialog";
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { type ProductErrorFragment, type WarehouseFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type FormsetAtomicData, type FormsetChange } from "@dashboard/hooks/useFormset";
import { type Container } from "@dashboard/types";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { applySpreadsheetColumnPaste } from "@dashboard/utils/spreadsheetPaste/applySpreadsheetColumnPaste";
import { sanitizeSpreadsheetInteger } from "@dashboard/utils/spreadsheetPaste/sanitizeSpreadsheetInteger";
import { Box, Button, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { type ChangeEvent, type ClipboardEvent, useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./ProductStocks.module.css";
import { StockVisibilityHint } from "./StockVisibilityHint";
import { WarehouseInformationMessage } from "./WarehouseInformationMessage";

export interface ProductStockPasteRow {
  id: string;
  label: string;
  quantityAllocated: number;
  value: string;
}

export interface ProductStockFormsetData {
  quantityAllocated: number;
}
export type ProductStockInput = FormsetAtomicData<ProductStockFormsetData, string, string>;
interface ProductStockFormData {
  sku: string;
  trackInventory: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

interface ProductStocksProps {
  productVariantChannelListings?: ChannelData[];
  data: ProductStockFormData;
  loading: boolean;
  errors: ProductErrorFragment[];
  hasVariants: boolean;
  stocks: ProductStockInput[];
  warehouses: WarehouseFragment[];
  onChange: FormsetChange;
  onStocksReplace?: (stocks: ProductStockPasteRow[]) => void;
  onFormDataChange: FormChange;
  onWarehouseStockAdd: (warehouseId: string, warehouseName: string) => void;
  onWarehouseStockDelete: (warehouseId: string) => void;
  onWarehouseConfigure: () => void;
  fetchMoreWarehouses: () => void;
  hasMoreWarehouses: boolean;
  isCreate: boolean;
  searchWarehouses: (query: string) => void;
}

export const ProductStocks = ({
  data,
  loading,
  hasVariants,
  errors,
  stocks,
  productVariantChannelListings = [],
  warehouses,
  hasMoreWarehouses,
  onChange,
  onStocksReplace,
  onFormDataChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete,
  onWarehouseConfigure,
  fetchMoreWarehouses,
  isCreate,
  searchWarehouses,
}: ProductStocksProps) => {
  const intl = useIntl();
  const [lastStockRowFocus, setLastStockRowFocus] = useState(false);
  const [isAssignWarehousesOpen, setIsAssignWarehousesOpen] = useState(false);
  const formErrors = getFormErrors(["sku"], errors);
  const sortedStocks = useMemo(
    () => [...stocks].sort((left, right) => left.label.localeCompare(right.label)),
    [stocks],
  );
  const stockPasteRows = useMemo<ProductStockPasteRow[]>(
    () =>
      sortedStocks.map(stock => ({
        id: stock.id,
        label: stock.label,
        quantityAllocated: stock.data?.quantityAllocated ?? 0,
        value: stock.value,
      })),
    [sortedStocks],
  );

  const stocksIds = useMemo(() => new Set(stocks.map(stock => stock.id)), [stocks]);

  // Excluding inside the dialog rather than here lets it notice when a page of warehouses
  // was filtered down to nothing and pull in the next one instead of looking empty.
  const isWarehouseAlreadyStocked = useCallback(
    (warehouse: Container) => stocksIds.has(warehouse.id),
    [stocksIds],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLElement>, startIndex: number) => {
      if (!onStocksReplace) {
        return;
      }

      const pastedText = event.clipboardData.getData("text/plain");

      if (pastedText === "") {
        return;
      }

      const { rows, handled } = applySpreadsheetColumnPaste({
        rows: stockPasteRows,
        startIndex,
        pastedText,
        sanitizeCell: cell => sanitizeSpreadsheetInteger(cell),
        setCell: (row, value) => ({ ...row, value }),
      });

      if (!handled) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onStocksReplace(rows);
    },
    [onStocksReplace, stockPasteRows],
  );

  const handleWarehouseStockAdd = (warehouseId: string, warehouseName: string) => {
    onWarehouseStockAdd(warehouseId, warehouseName);
    setLastStockRowFocus(true);
  };
  const handleStockInputFocus = (input: HTMLDivElement) => {
    if (lastStockRowFocus && input) {
      input.focus();
      setLastStockRowFocus(false);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFormDataChange(e);
  };

  const showAssignWarehousesButton = !isCreate && productVariantChannelListings?.length > 0;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.title)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box __width="50%">
          <Input
            disabled={loading}
            error={!!formErrors.sku}
            label={intl.formatMessage(messages.sku)}
            name="sku"
            onChange={handleChange}
            value={data.sku}
            data-test-id="sku"
            size="small"
            helperText={getProductErrorMessage(formErrors.sku, intl)}
          />
        </Box>

        <Box paddingTop={5}>
          <Box>
            <Checkbox
              checked={data.trackInventory}
              name="trackInventory"
              disabled={loading}
              onCheckedChange={value =>
                onFormDataChange({ target: { name: "trackInventory", value } })
              }
            >
              <Box display="flex" flexDirection="column">
                <Text>
                  <FormattedMessage {...messages.trackInventory} />
                </Text>
              </Box>
            </Checkbox>

            <Text marginLeft={5} size={2} color="default2">
              <FormattedMessage {...messages.trackInventoryDescription} />
            </Text>
          </Box>
          <Box display="grid" gap={2} marginTop={5}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column">
                <Title2>
                  <FormattedMessage {...messages.stock} />
                </Title2>
                {!productVariantChannelListings?.length && (
                  <Text size={2} color="default2">
                    <FormattedMessage {...messages.noChannelWarehousesAllocation} />
                  </Text>
                )}
              </Box>
              {showAssignWarehousesButton && (
                <Button
                  onClick={() => setIsAssignWarehousesOpen(true)}
                  disabled={loading}
                  type="button"
                  variant="secondary"
                  data-test-id="assign-warehouse-button"
                >
                  <FormattedMessage {...messages.assignWarehouses} />
                </Button>
              )}
            </Box>
            <WarehouseInformationMessage
              isCreate={isCreate}
              hasVariants={hasVariants}
              hasStocks={stocks?.length > 0}
              onWarehouseConfigure={onWarehouseConfigure}
            />
          </Box>
        </Box>
        {productVariantChannelListings?.length > 0 && stocks?.length > 0 && (
          <Box marginTop={5}>
            <Box className={styles.list} data-test-id="product-variant-stock-list">
              <Text size={2} color="default2" className={styles.pasteHint}>
                <FormattedMessage {...messages.stockPasteHint} />
              </Text>
              <Box className={styles.headerRow}>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.warehouseName} />
                </Text>
                <Text size={2} color="default2" className={styles.allocatedValue}>
                  <FormattedMessage {...messages.allocated} />
                </Text>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.quantity} />
                </Text>
                <span />
              </Box>
              {stockPasteRows.map((stock, index) => {
                const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target;

                  if (value === "" || /^\d+$/.test(value)) {
                    onChange(stock.id, value);
                  }
                };

                return (
                  <Box key={stock.id} className={styles.row} data-test-id={stock.label}>
                    <Text size={3} className={styles.warehouseName} title={stock.label}>
                      {stock.label}
                    </Text>
                    <Text size={3} className={styles.allocatedValue}>
                      {stock.quantityAllocated}
                    </Text>
                    <div className={styles.inputCell}>
                      <Input
                        data-test-id="stock-input"
                        disabled={loading}
                        onChange={handleQuantityChange}
                        onPasteCapture={event => handlePaste(event, index)}
                        value={stock.value}
                        size="small"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        ref={input =>
                          stockPasteRows.length === index + 1 && handleStockInputFocus(input)
                        }
                      />
                    </div>
                    <Box className={styles.deleteCell}>
                      <Button
                        type="button"
                        variant="secondary"
                        icon={
                          <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                        }
                        onClick={() => onWarehouseStockDelete(stock.id)}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box paddingTop={3}>
              <StockVisibilityHint />
            </Box>
          </Box>
        )}

        <AssignWarehouseDialog
          warehouses={warehouses ?? []}
          excludeContainer={isWarehouseAlreadyStocked}
          hasMore={hasMoreWarehouses}
          onFetchMore={fetchMoreWarehouses}
          loading={loading}
          onFetch={searchWarehouses}
          open={isAssignWarehousesOpen}
          onClose={() => setIsAssignWarehousesOpen(false)}
          onSubmit={selectedWarehouses => {
            selectedWarehouses.forEach(warehouse => {
              handleWarehouseStockAdd(warehouse.id, warehouse.name);
            });
          }}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
