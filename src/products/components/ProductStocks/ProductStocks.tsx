// @ts-strict-ignore
import { ChannelData, ChannelPriceData } from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ProductErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { FormsetAtomicData, FormsetChange } from "@dashboard/hooks/useFormset";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import createNonNegativeValueChangeHandler from "@dashboard/utils/handlers/nonNegativeValueChangeHandler";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Checkbox, Input, Text, TrashBinIcon, vars } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductStocksAssignWarehouses } from "./components/ProductStocksAssignWarehouses";
import { useWarehouses } from "./hooks/useWarehouses";
import { messages } from "./messages";

export interface ProductStockFormsetData {
  quantityAllocated: number;
}
export type ProductStockInput = FormsetAtomicData<ProductStockFormsetData, string, string>;
export interface ProductStockFormData {
  sku: string;
  trackInventory: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

export interface ProductStocksProps {
  productVariantChannelListings?: ChannelData[];
  data: ProductStockFormData;
  channels: ChannelPriceData[];
  disabled: boolean;
  errors: ProductErrorFragment[];
  hasVariants: boolean;
  stocks: ProductStockInput[];
  onChange: FormsetChange;
  onFormDataChange: FormChange;
  onWarehouseStockAdd: (warehouseId: string, warehouseName: string) => void;
  onWarehouseStockDelete: (warehouseId: string, warehouseName: string) => void;
  onWarehouseConfigure: () => void;
}

export const ProductStocks: React.FC<ProductStocksProps> = ({
  data,
  channels,
  disabled,
  hasVariants,
  errors,
  stocks,
  productVariantChannelListings = [],
  onChange,
  onFormDataChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete,
  onWarehouseConfigure,
}) => {
  const intl = useIntl();
  const [lastStockRowFocus, setLastStockRowFocus] = React.useState(false);
  const formErrors = getFormErrors(["sku"], errors);

  const {
    loadMoreWarehouses,
    warehouses,
    warehousesToAssign,
    hasMoreWarehouses,
    hasWarehousesLoading,
  } = useWarehouses(
    channels.map(channel => channel.id),
    stocks.map(stock => stock.id),
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormDataChange(e);
  };

  return (
    <DashboardCard>
      <DashboardCard.Title>{intl.formatMessage(messages.title)}</DashboardCard.Title>
      <DashboardCard.Content>
        <Box __width="50%">
          <Input
            disabled={disabled}
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
              disabled={disabled}
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
            <Box display="flex" flexDirection="column">
              <Text size={4} fontWeight="bold">
                <FormattedMessage {...messages.stock} />
              </Text>
              {!productVariantChannelListings?.length && (
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.noChannelWarehousesAllocation} />
                </Text>
              )}
            </Box>
            {!warehouses?.length && (
              <Text color="default2">
                {hasVariants ? (
                  <FormattedMessage
                    {...messages.configureWarehouseForVariant}
                    values={{
                      a: chunks => <Link onClick={onWarehouseConfigure}>{chunks}</Link>,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    {...messages.configureWarehouseForProduct}
                    values={{
                      a: chunks => <Link onClick={onWarehouseConfigure}>{chunks}</Link>,
                    }}
                  />
                )}
              </Text>
            )}
          </Box>
        </Box>
        {productVariantChannelListings?.length > 0 &&
          warehouses?.length > 0 &&
          stocks?.length > 0 && (
            <Table>
              <TableHead>
                <TableRowLink>
                  <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                    <Text size={2} color="default2">
                      <FormattedMessage {...messages.warehouseName} />
                    </Text>
                  </TableCell>
                  <TableCell style={{ width: 100, verticalAlign: "middle" }}>
                    <Text size={2} color="default2">
                      <FormattedMessage {...messages.allocated} />
                    </Text>
                  </TableCell>
                  <TableCell style={{ width: 200, verticalAlign: "middle" }}>
                    <Text size={2} color="default2">
                      <FormattedMessage {...messages.quantity} />
                    </Text>
                  </TableCell>
                  <TableCell />
                </TableRowLink>
              </TableHead>
              <TableBody>
                {renderCollection(stocks, (stock, index) => {
                  const handleQuantityChange = createNonNegativeValueChangeHandler(event =>
                    onChange(stock.id, event.target.value),
                  );

                  return (
                    <TableRowLink data-test-id={stock.label} key={stock.id}>
                      <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                        <Text>{stock.label}</Text>
                      </TableCell>
                      <TableCell>
                        <Text>{stock.data?.quantityAllocated || 0}</Text>
                      </TableCell>
                      <TableCell>
                        <Input
                          data-test-id="stock-input"
                          disabled={disabled}
                          onChange={handleQuantityChange}
                          value={stock.value}
                          size="small"
                          type="number"
                          min={0}
                          ref={input => stocks.length === index + 1 && handleStockInputFocus(input)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="secondary"
                          icon={<TrashBinIcon />}
                          onClick={() => onWarehouseStockDelete(stock.id, stock.label)}
                        />
                      </TableCell>
                    </TableRowLink>
                  );
                })}
              </TableBody>
            </Table>
          )}

        {productVariantChannelListings?.length > 0 &&
          warehouses?.length > 0 &&
          warehousesToAssign.length > 0 && (
            <ProductStocksAssignWarehouses
              warehousesToAssign={warehousesToAssign}
              hasMoreWarehouses={hasMoreWarehouses}
              hasWarehousesLoading={hasWarehousesLoading}
              loadMoreWarehouses={loadMoreWarehouses}
              onWarehouseSelect={handleWarehouseStockAdd}
            />
          )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
