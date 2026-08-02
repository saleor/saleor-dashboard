import {
  type BulkPublishDefaults,
  type BulkPublishWarehouse,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import { Box, Checkbox, Input, Select, Text } from "@saleor/macaw-ui-next";
import { useId } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { BulkPublishCallout } from "./BulkPublishCallout";
import styles from "./BulkPublishDefaultsStep.module.css";
import { canSetBulkPublishStock, getBulkPublishStockScope } from "./bulkPublishStockScope";
import {
  BULK_PUBLISH_STOCK_ALL_WAREHOUSES,
  getBulkPublishStockWarehouseSelectValue,
} from "./bulkPublishStockWarehouses";
import { messages } from "./messages";

interface BulkPublishDefaultsStepProps {
  defaults: BulkPublishDefaults;
  channelWarehouses: BulkPublishWarehouse[];
  shopWarehouseCount: number;
  onChange: (defaults: BulkPublishDefaults) => void;
}

interface DefaultsCheckboxOptionProps {
  checked: boolean;
  disabled?: boolean;
  label: React.ReactNode;
  description: React.ReactNode;
  onCheckedChange: (checked: boolean) => void;
}

const DefaultsCheckboxOption = ({
  checked,
  disabled,
  label,
  description,
  onCheckedChange,
}: DefaultsCheckboxOptionProps) => {
  const labelId = useId();

  const toggle = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <Box className={styles.option}>
      <Box className={styles.optionCheckbox}>
        <Checkbox
          checked={checked}
          disabled={disabled}
          aria-labelledby={labelId}
          onCheckedChange={value => onCheckedChange(value === true)}
        />
      </Box>
      <Text
        id={labelId}
        className={styles.optionLabel}
        size={3}
        fontWeight="medium"
        cursor={disabled ? undefined : "pointer"}
        onClick={toggle}
      >
        {label}
      </Text>
      <Text size={2} color="default2" className={styles.optionDescription}>
        {description}
      </Text>
    </Box>
  );
};

export const BulkPublishDefaultsStep = ({
  defaults,
  channelWarehouses,
  shopWarehouseCount,
  onChange,
}: BulkPublishDefaultsStepProps) => {
  const intl = useIntl();
  const stockScope = getBulkPublishStockScope({ channelWarehouses, shopWarehouseCount });
  const canSetStock = canSetBulkPublishStock(stockScope);
  const assignedWarehouses = stockScope.kind === "channel_warehouses" ? stockScope.warehouses : [];
  const showWarehousePicker =
    canSetStock && defaults.stock.enabled && assignedWarehouses.length > 1;
  const singleAssignedWarehouse =
    assignedWarehouses.length === 1 ? assignedWarehouses[0] : undefined;
  const warehouseSelectValue = getBulkPublishStockWarehouseSelectValue(defaults.stock);

  const handleWarehouseScopeChange = (value: string) => {
    if (value === BULK_PUBLISH_STOCK_ALL_WAREHOUSES) {
      onChange({
        ...defaults,
        stock: {
          ...defaults.stock,
          warehouseScope: "all_channel",
          warehouseId: "",
        },
      });

      return;
    }

    onChange({
      ...defaults,
      stock: {
        ...defaults.stock,
        warehouseScope: "single",
        warehouseId: value,
      },
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Text size={3} color="default2">
        <FormattedMessage {...messages.defaultsIntro} />
      </Text>

      <Box className={styles.section}>
        <Box className={styles.sectionHeader}>
          <Text size={4} fontWeight="medium">
            <FormattedMessage {...messages.visibilitySectionTitle} />
          </Text>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.visibilitySectionDescription} />
          </Text>
        </Box>
        <DefaultsCheckboxOption
          checked={defaults.isPublished}
          label={<FormattedMessage {...messages.publishLabel} />}
          description={<FormattedMessage {...messages.publishDescription} />}
          onCheckedChange={isPublished =>
            onChange({
              ...defaults,
              isPublished,
            })
          }
        />
        <DefaultsCheckboxOption
          checked={defaults.visibleInListings}
          label={<FormattedMessage {...messages.visibleInListings} />}
          description={<FormattedMessage {...messages.visibleInListingsDescription} />}
          onCheckedChange={visibleInListings =>
            onChange({
              ...defaults,
              visibleInListings,
            })
          }
        />
        <DefaultsCheckboxOption
          checked={defaults.isAvailableForPurchase}
          label={<FormattedMessage {...messages.availableForPurchase} />}
          description={<FormattedMessage {...messages.availableForPurchaseDescription} />}
          onCheckedChange={isAvailableForPurchase =>
            onChange({
              ...defaults,
              isAvailableForPurchase,
            })
          }
        />
      </Box>

      <Box className={styles.section}>
        <Box className={styles.sectionHeader}>
          <Box display="flex" alignItems="baseline" gap={2}>
            <Text size={4} fontWeight="medium">
              <FormattedMessage {...messages.inventorySectionTitle} />
            </Text>
            <Text size={2} color="default2">
              <FormattedMessage {...messages.inventorySectionOptional} />
            </Text>
          </Box>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.inventorySectionNote} />
          </Text>
        </Box>

        <DefaultsCheckboxOption
          checked={defaults.stock.enabled}
          disabled={!canSetStock}
          label={<FormattedMessage {...messages.enableStock} />}
          description={<FormattedMessage {...messages.enableStockDescription} />}
          onCheckedChange={enabled =>
            onChange({
              ...defaults,
              stock: {
                ...defaults.stock,
                enabled,
              },
            })
          }
        />

        {!canSetStock && stockScope.kind === "no_shop_warehouses" ? (
          <Box className={styles.indentedContent}>
            <BulkPublishCallout variant="info">
              <FormattedMessage {...messages.stockRequiresWarehouse} />
            </BulkPublishCallout>
          </Box>
        ) : null}

        {!canSetStock && stockScope.kind === "no_channel_warehouses" ? (
          <Box className={styles.indentedContent}>
            <BulkPublishCallout variant="info">
              <FormattedMessage {...messages.stockRequiresChannelWarehouse} />
            </BulkPublishCallout>
          </Box>
        ) : null}

        {canSetStock && !defaults.stock.enabled ? (
          <Box className={styles.indentedContent}>
            <BulkPublishCallout variant="info">
              <FormattedMessage {...messages.stockExistingInventoryInfo} />
            </BulkPublishCallout>
          </Box>
        ) : null}

        {canSetStock && defaults.stock.enabled && singleAssignedWarehouse ? (
          <Box className={styles.indentedContent}>
            <BulkPublishCallout variant="info">
              <FormattedMessage
                {...messages.stockSingleWarehouseInfo}
                values={{ warehouseName: singleAssignedWarehouse.name }}
              />
            </BulkPublishCallout>
          </Box>
        ) : null}

        {showWarehousePicker ? (
          <Box className={styles.nestedField}>
            <Box __maxWidth="320px">
              <Select
                data-test-id="bulk-publish-stock-warehouse-scope"
                size="small"
                label={intl.formatMessage(messages.stockWarehouseScopeTitle)}
                helperText={
                  defaults.stock.warehouseScope === "single"
                    ? intl.formatMessage(messages.stockSingleWarehouseDescription)
                    : intl.formatMessage(messages.stockAllChannelWarehousesDescription)
                }
                options={[
                  {
                    label: intl.formatMessage(messages.stockAllChannelWarehousesLabel),
                    value: BULK_PUBLISH_STOCK_ALL_WAREHOUSES,
                  },
                  ...assignedWarehouses.map(warehouse => ({
                    label: warehouse.name,
                    value: warehouse.id,
                  })),
                ]}
                value={warehouseSelectValue}
                onChange={handleWarehouseScopeChange}
              />
            </Box>
          </Box>
        ) : null}

        {canSetStock && defaults.stock.enabled ? (
          <Box className={styles.nestedField}>
            <Box __maxWidth="240px">
              <Input
                data-test-id="bulk-publish-default-stock"
                label={intl.formatMessage(messages.defaultStockQuantity)}
                size="small"
                type="text"
                inputMode="numeric"
                value={defaults.stock.defaultQuantity}
                onChange={event =>
                  onChange({
                    ...defaults,
                    stock: {
                      ...defaults.stock,
                      defaultQuantity: event.target.value,
                    },
                  })
                }
              />
            </Box>
            <Text size={3} color="default2">
              <FormattedMessage
                {...messages.stockPerWarehouseHint}
                values={{
                  scope: defaults.stock.warehouseScope === "single" ? "single" : "all",
                }}
              />
            </Text>
            <Text size={3} color="default2">
              <FormattedMessage {...messages.stockDescription} />
            </Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
