// import { isLimitReached } from "@dashboard/utils/limits";
import { ChannelData } from "@dashboard/channels/utils";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid, { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { Choice } from "@dashboard/components/SingleSelectField";
import {
  AttributeInputTypeEnum,
  ProductDetailsVariantFragment,
  ProductFragment,
  RefreshLimitsQuery,
  useWarehouseListQuery,
} from "@dashboard/graphql";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import EditIcon from "@dashboard/icons/Edit";
import { buttonMessages } from "@dashboard/intl";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  useAttributesAdapter,
  useChannelAdapter,
  useChannelAvailabilityAdapter,
  useWarehouseAdapter,
  variantsStaticColumnsAdapter,
} from "./datagrid";
import messages from "./messages";
import { getData, getError } from "./utils";

interface ProductVariantsProps {
  channels: ChannelData[];
  errors: ProductVariantListError[];
  limits: RefreshLimitsQuery["shop"]["limits"];
  variantAttributes: ProductFragment["productType"]["variantAttributes"];
  variants: ProductDetailsVariantFragment[];
  productName: string;
  onAttributeValuesSearch: (id: string, query: string) => Promise<Array<Choice<string, string>>>;
  onChange: (data: DatagridChangeOpts) => void;
  onRowClick: (id: string) => void;
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  channels,
  errors,
  variants,
  variantAttributes,
  productName,
  onAttributeValuesSearch,
  onChange,
  onRowClick,
}) => {
  const intl = useIntl();
  // https://github.com/saleor/saleor-dashboard/issues/4165
  const { data: warehousesData } = useWarehouseListQuery({
    variables: {
      first: 50,
    },
  });
  const warehouses = mapEdgesToItems(warehousesData?.warehouses);

  // Normally this should be in LS handled by useListSettings hook
  // https://github.com/saleor/saleor-dashboard/issues/4164

  const initialSettings = React.useMemo(
    () =>
      channels && warehouses && variantAttributes
        ? [
            "name",
            "sku",
            ...channels.flatMap(channel => [
              `availableInChannel:${channel.id}`,
              `channel:${channel.id}`,
            ]),
            ...warehouses.map(warehouse => `warehouse:${warehouse.id}`),
            ...(variantAttributes
              ?.filter(
                attribute =>
                  attribute.inputType === AttributeInputTypeEnum.DROPDOWN ||
                  attribute.inputType === AttributeInputTypeEnum.PLAIN_TEXT,
              )
              .map(attribute => `attribute:${attribute.id}`) ?? []),
          ]
        : undefined,
    [channels, variantAttributes, warehouses],
  );
  const [columnSettings, setColumnSettings] = useStateFromProps<string[] | undefined>(
    initialSettings,
  );

  React.useEffect(() => {
    if (columnSettings) {
      handlers.onResetDynamicToInitial();
    }
  }, [columnSettings]);

  const handleColumnChange = React.useCallback(
    picked => {
      setColumnSettings(picked);
    },
    [setColumnSettings],
  );

  // const limitReached = isLimitReached(limits, "productVariants");

  const channelCategory = useChannelAdapter({
    intl,
    listings: channels,
    selectedColumns: columnSettings,
  });
  const availabilityCategory = useChannelAvailabilityAdapter({
    intl,
    listings: channels,
    selectedColumns: columnSettings,
  });
  const attributeCategory = useAttributesAdapter({
    intl,
    selectedColumns: columnSettings,
    attributes: variantAttributes,
  });
  const warehouseCategory = useWarehouseAdapter({
    selectedColumns: columnSettings,
    intl,
    warehouses,
  });
  const memoizedStaticColumns = React.useMemo(() => variantsStaticColumnsAdapter(intl), [intl]);
  const {
    handlers,
    columnCategories,
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: memoizedStaticColumns,
    columnCategories: [channelCategory, availabilityCategory, attributeCategory, warehouseCategory],
    selectedColumns: columnSettings ?? [],
    onSave: handleColumnChange,
  });
  const getCellContent = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getData({
        availableColumns: visibleColumns,
        column,
        row,
        channels,
        variants,
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [channels, visibleColumns, onAttributeValuesSearch, variants],
  );
  const getCellError = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getError(errors, {
        availableColumns: visibleColumns,
        column,
        row,
        channels,
        variants,
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [errors, visibleColumns, channels, variants, onAttributeValuesSearch],
  );

  return (
    <Datagrid
      addButtonLabel={intl.formatMessage({
        defaultMessage: "Add variant",
        id: "3C3Nj5",
        description: "button",
      })}
      fillHandle={true}
      availableColumns={visibleColumns}
      emptyText={intl.formatMessage(messages.empty)}
      getCellContent={getCellContent}
      getCellError={getCellError}
      menuItems={index => [
        {
          label: "Edit Variant",
          onSelect: () => onRowClick(variants[index].id),
          Icon: <EditIcon />,
        },
      ]}
      rows={variants?.length ?? 0}
      selectionActions={(indexes, { removeRows }) => (
        <Button
          data-test-id="bulk-delete-button"
          variant="tertiary"
          onClick={() => removeRows(indexes)}
        >
          <FormattedMessage {...buttonMessages.delete} />
        </Button>
      )}
      onColumnResize={handlers.onResize}
      onColumnMoved={handlers.onMove}
      renderColumnPicker={() => (
        <ColumnPicker
          staticColumns={staticColumns}
          dynamicColumns={dynamicColumns}
          selectedColumns={selectedColumns}
          columnCategories={columnCategories}
          onToggle={handlers.onToggle}
          side="left"
        />
      )}
      title={intl.formatMessage(messages.title)}
      fullScreenTitle={intl.formatMessage(messages.fullScreenTitle, {
        name: productName,
      })}
      onChange={onChange}
      recentlyAddedColumn={recentlyAddedColumn}
    />
  );
};
ProductVariants.displayName = "ProductVariants";
export default ProductVariants;
