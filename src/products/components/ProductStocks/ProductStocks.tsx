// @ts-strict-ignore
import {
  ChannelData,
  ChannelPriceAndPreorderArgs,
  ChannelPriceData,
} from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import { DateTimeTimezoneField } from "@dashboard/components/DateTimeTimezoneField";
import Link from "@dashboard/components/Link";
import PreviewPill from "@dashboard/components/PreviewPill";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ProductErrorFragment } from "@dashboard/graphql";
import { FormChange, FormErrors } from "@dashboard/hooks/useForm";
import { FormsetAtomicData, FormsetChange } from "@dashboard/hooks/useFormset";
import { sectionNames } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import createNonNegativeValueChangeHandler from "@dashboard/utils/handlers/nonNegativeValueChangeHandler";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import {
  Box,
  Button,
  Checkbox,
  Input,
  Text,
  TrashBinIcon,
  vars,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductCreateData } from "../ProductCreatePage";
import { ProductVariantCreateData } from "../ProductVariantCreatePage/form";
import { ProductVariantUpdateData } from "../ProductVariantPage/form";
import { ProductStocksAssignWarehouses } from "./components/ProductStocksAssignWarehouses";
import { messages } from "./messages";
import { useWarehouses } from "./useWarehouses";

export interface ProductStockFormsetData {
  quantityAllocated: number;
}
export type ProductStockInput = FormsetAtomicData<
  ProductStockFormsetData,
  string
>;
export interface ProductStockFormData {
  sku: string;
  trackInventory: boolean;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

export interface ProductStocksProps {
  productVariantChannelListings?: ChannelData[];
  data: ProductStockFormData;
  disabled: boolean;
  channels: ChannelPriceData[];
  errors: ProductErrorFragment[];
  formErrors:
    | FormErrors<ProductVariantCreateData>
    | FormErrors<ProductVariantUpdateData>
    | FormErrors<ProductCreateData>;
  hasVariants: boolean;
  stocks: ProductStockInput[];
  onVariantChannelListingChange?: (
    id: string,
    data: Partial<ChannelPriceAndPreorderArgs>,
  ) => void;
  onChange: FormsetChange;
  onChangePreorderEndDate: FormChange;
  onEndPreorderTrigger?: () => void;
  onFormDataChange: FormChange;
  onWarehouseStockAdd: (warehouseId: string, warehouseLabel: string) => void;
  onWarehouseStockDelete: (warehouseId: string) => void;
  onWarehouseConfigure: () => void;
}

export const ProductStocks: React.FC<ProductStocksProps> = ({
  data,
  disabled,
  hasVariants,
  errors,
  channels,
  formErrors: localFormErrors,
  onChangePreorderEndDate,
  stocks,
  productVariantChannelListings = [],
  onChange,
  onEndPreorderTrigger,
  onFormDataChange,
  onVariantChannelListingChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete,
  onWarehouseConfigure,
}) => {
  const intl = useIntl();
  const [lastStockRowFocus, setLastStockRowFocus] = React.useState(false);
  const unitsLeft = parseInt(data.globalThreshold, 10) - data.globalSoldUnits;

  const {
    loadMoreWarehouses,
    warehouses,
    warehousesToAssign,
    hasMoreWarehouses,
  } = useWarehouses(
    channels.map(channel => channel.id),
    stocks.map(stock => stock.id),
  );

  const formErrors = getFormErrors(["sku"], errors);

  const onThresholdChange =
    createNonNegativeValueChangeHandler(onFormDataChange);

  const handleWarehouseStockAdd = (
    warehouseId: string,
    warehouseLabel: string,
  ) => {
    onWarehouseStockAdd(warehouseId, warehouseLabel);
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
      <DashboardCard.Title>
        {intl.formatMessage(messages.title)}
      </DashboardCard.Title>
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

        <Box paddingY={2} display="grid" gap={2}>
          <Checkbox
            checked={data.isPreorder}
            name="isPreorder"
            onCheckedChange={value => {
              if (onEndPreorderTrigger && data.isPreorder) {
                onEndPreorderTrigger();
              } else {
                onFormDataChange({ target: { name: "isPreorder", value } });
              }
            }}
            disabled={disabled}
          >
            <Box display="flex" gap={1} paddingY={1.5}>
              <Text>
                <FormattedMessage {...messages.variantInPreorder} />
              </Text>
              <PreviewPill />
            </Box>
          </Checkbox>

          {!data.isPreorder && (
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
                <Text variant="caption" color="textNeutralSubdued">
                  <FormattedMessage {...messages.trackInventoryDescription} />
                </Text>
              </Box>
            </Checkbox>
          )}

          {!data.isPreorder && (
            <Box display="grid" gap={2}>
              <Box display="flex" flexDirection="column">
                <Text>
                  <FormattedMessage {...messages.quantity} />
                </Text>
                {!productVariantChannelListings?.length && (
                  <Text variant="caption" color="textNeutralSubdued">
                    <FormattedMessage
                      {...messages.noChannelWarehousesAllocation}
                    />
                  </Text>
                )}
              </Box>
              {!warehouses?.length && (
                <Text color="textNeutralSubdued">
                  {hasVariants ? (
                    <FormattedMessage
                      {...messages.configureWarehouseForVariant}
                      values={{
                        a: chunks => (
                          <Link onClick={onWarehouseConfigure}>{chunks}</Link>
                        ),
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      {...messages.configureWarehouseForProduct}
                      values={{
                        a: chunks => (
                          <Link onClick={onWarehouseConfigure}>{chunks}</Link>
                        ),
                      }}
                    />
                  )}
                </Text>
              )}
            </Box>
          )}
        </Box>
      </DashboardCard.Content>
      {productVariantChannelListings?.length > 0 && !data.isPreorder && (
        <Table>
          <TableHead>
            <TableRowLink>
              <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                <Text variant="caption" color="textNeutralSubdued">
                  <FormattedMessage {...messages.warehouseName} />
                </Text>
              </TableCell>
              <TableCell style={{ width: 200, verticalAlign: "middle" }}>
                <Text variant="caption" color="textNeutralSubdued">
                  <FormattedMessage {...messages.allocated} />
                </Text>
              </TableCell>
              <TableCell style={{ width: 200, verticalAlign: "middle" }}>
                <Text variant="caption" color="textNeutralSubdued">
                  <FormattedMessage {...messages.quantity} />
                </Text>
              </TableCell>
              <TableCell />
            </TableRowLink>
          </TableHead>
          <TableBody>
            {renderCollection(stocks, (stock, index) => {
              const handleQuantityChange = createNonNegativeValueChangeHandler(
                event => onChange(stock.id, event.target.value),
              );

              return (
                <TableRowLink key={stock.id}>
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
                      ref={input =>
                        stocks.length === index + 1 &&
                        handleStockInputFocus(input)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="secondary"
                      icon={<TrashBinIcon />}
                      onClick={() => onWarehouseStockDelete(stock.id)}
                    />
                  </TableCell>
                </TableRowLink>
              );
            })}

            <ProductStocksAssignWarehouses
              warehousesToAssign={warehousesToAssign}
              hasMoreWarehouses={hasMoreWarehouses}
              hasWarehouseLoadding={warehousesToAssign.length === 0}
              loadMoreWarehouses={loadMoreWarehouses}
              onSelect={handleWarehouseStockAdd}
            />
          </TableBody>
        </Table>
      )}
      {data.isPreorder && (
        <DashboardCard.Content>
          <Box display="grid" gap={2}>
            <Text variant="caption">
              <FormattedMessage {...messages.preorderEndDateSetup} />
            </Text>
            {data.hasPreorderEndDate && (
              <Box>
                <DateTimeTimezoneField
                  name={"preorderEndDateTime"}
                  disabled={disabled}
                  futureDatesOnly
                  fullWidth={false}
                  error={localFormErrors.preorderEndDateTime}
                  value={data?.preorderEndDateTime}
                  onChange={event =>
                    onChangePreorderEndDate({
                      target: {
                        name: "preorderEndDateTime",
                        value: event,
                      },
                    })
                  }
                />
              </Box>
            )}
            {/* @ts-ignore */}
            <Box __alignSelf="end">
              <Button
                name="hasPreorderEndDate"
                variant="secondary"
                disabled={disabled}
                type="button"
                onClick={() =>
                  onFormDataChange({
                    target: {
                      name: "hasPreorderEndDate",
                      value: !data.hasPreorderEndDate,
                    },
                  })
                }
              >
                {data.hasPreorderEndDate
                  ? intl.formatMessage(messages.endDateCancel)
                  : intl.formatMessage(messages.endDateSetup)}
              </Button>
            </Box>
          </Box>

          <Box display="grid" gap={1} paddingTop={2}>
            <Text variant="caption" color="textNeutralSubdued">
              <FormattedMessage {...messages.preorderProductsAvailability} />
            </Text>
            <Box display="grid" gap={1.5}>
              <Box __width="50%">
                <Input
                  min={0}
                  type="text"
                  disabled={disabled}
                  label={intl.formatMessage(messages.preorderTresholdLabel)}
                  name="globalThreshold"
                  onChange={onThresholdChange}
                  value={data.globalThreshold ?? ""}
                  size="small"
                  helperText={intl.formatMessage(
                    messages.preorderTresholdDescription,
                  )}
                />
              </Box>

              {productVariantChannelListings?.length > 0 && (
                <Text variant="caption">
                  {data.globalThreshold
                    ? intl.formatMessage(messages.preorderTresholdUnitsLeft, {
                        unitsLeft,
                      })
                    : intl.formatMessage(messages.preorderTresholdUnlimited)}
                </Text>
              )}
            </Box>
          </Box>
        </DashboardCard.Content>
      )}

      {productVariantChannelListings?.length > 0 && data.isPreorder && (
        <Table>
          <TableHead>
            <TableRowLink>
              <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                <Text variant="caption" color="textNeutralSubdued">
                  <FormattedMessage {...sectionNames.channels} />
                </Text>
              </TableCell>
              <TableCell style={{ width: 200, verticalAlign: "middle" }}>
                <Text variant="caption" color="textNeutralSubdued">
                  <FormattedMessage {...messages.soldUnits} />
                </Text>
              </TableCell>
              <TableCell style={{ width: 200, verticalAlign: "middle" }}>
                <Text variant="caption" color="textNeutralSubdued">
                  <FormattedMessage {...messages.channelTreshold} />
                </Text>
              </TableCell>
            </TableRowLink>
          </TableHead>
          <TableBody>
            {renderCollection(productVariantChannelListings, listing => {
              if (!listing) {
                return;
              }

              return (
                <TableRowLink key={listing.id}>
                  <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                    <Text>{listing.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{listing?.unitsSold || 0}</Text>
                  </TableCell>
                  <TableCell>
                    <Input
                      min={0}
                      type="number"
                      name="channel-threshold"
                      disabled={disabled}
                      onChange={e => {
                        onVariantChannelListingChange(listing.id, {
                          costPrice: listing.costPrice,
                          price: listing.price,
                          preorderThreshold:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        });
                      }}
                      value={listing?.preorderThreshold ?? ""}
                      size="small"
                      placeholder={intl.formatMessage(
                        messages.preorderTresholdUnlimited,
                      )}
                    />
                  </TableCell>
                </TableRowLink>
              );
            })}
          </TableBody>
        </Table>
      )}
    </DashboardCard>
  );
};
