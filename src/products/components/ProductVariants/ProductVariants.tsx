// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid, {
  GetCellContentOpts,
} from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { Choice } from "@dashboard/components/SingleSelectField";
import {
  AttributeInputTypeEnum,
  ProductDetailsVariantFragment,
  ProductFragment,
  RefreshLimitsQuery,
  WarehouseFragment,
} from "@dashboard/graphql";
import EditIcon from "@dashboard/icons/Edit";
import { buttonMessages } from "@dashboard/intl";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
// import { isLimitReached } from "@dashboard/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";
import { getColumnData, getData, getError } from "./utils";

interface ProductVariantsProps {
  channels: ChannelData[];
  errors: ProductVariantListError[];
  limits: RefreshLimitsQuery["shop"]["limits"];
  variantAttributes: ProductFragment["productType"]["variantAttributes"];
  variants: ProductDetailsVariantFragment[];
  warehouses: WarehouseFragment[];
  productName: string;
  onAttributeValuesSearch: (
    id: string,
    query: string,
  ) => Promise<Array<Choice<string, string>>>;
  onChange: (data: DatagridChangeOpts) => void;
  onRowClick: (id: string) => void;
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  channels,
  errors,
  variants,
  warehouses,
  variantAttributes,
  productName,
  onAttributeValuesSearch,
  onChange,
  onRowClick,
}) => {
  const intl = useIntl();
  // const limitReached = isLimitReached(limits, "productVariants");

  const variantDefaultColumns = React.useMemo(
    () =>
      variantAttributes && warehouses && channels
        ? [
            "name",
            "sku",
            ...channels?.flatMap(channel => [
              `availableInChannel:${channel.id}`,
              `channel:${channel.id}`,
            ]),
            ...warehouses?.map(warehouse => `stock:${warehouse.id}`),
            ...variantAttributes
              .filter(attribute =>
                [
                  AttributeInputTypeEnum.DROPDOWN,
                  AttributeInputTypeEnum.PLAIN_TEXT,
                ].includes(attribute.inputType),
              )
              .map(attribute => `attribute:${attribute.id}`),
          ].map(c =>
            getColumnData(c, channels, warehouses, variantAttributes, intl),
          )
        : [],
    [variantAttributes, warehouses, channels, intl],
  );

  const {
    availableColumnsChoices,
    columnChoices,
    columns,
    defaultColumns,
    onColumnMoved,
    onColumnResize,
    onColumnsChange,
    picker,
  } = useColumnsDefault(variantDefaultColumns);

  const getCellContent = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getData({
        availableColumns: columns,
        column,
        row,
        channels,
        variants,
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [channels, columns, onAttributeValuesSearch, variants],
  );

  const getCellError = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getError(errors, {
        availableColumns: columns,
        column,
        row,
        channels,
        variants,
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [errors, columns, channels, variants, onAttributeValuesSearch],
  );

  return (
    <Datagrid
      addButtonLabel={intl.formatMessage({
        defaultMessage: "Add variant",
        id: "3C3Nj5",
        description: "button",
      })}
      fillHandle={true}
      availableColumns={columns}
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
        <Button variant="tertiary" onClick={() => removeRows(indexes)}>
          <FormattedMessage {...buttonMessages.delete} />
        </Button>
      )}
      onColumnResize={onColumnResize}
      onColumnMoved={onColumnMoved}
      renderColumnPicker={defaultProps => (
        <ColumnPicker
          {...defaultProps}
          availableColumns={availableColumnsChoices}
          initialColumns={columnChoices}
          defaultColumns={defaultColumns}
          onSave={onColumnsChange}
          hasMore={false}
          loading={false}
          onFetchMore={() => undefined}
          onQueryChange={picker.setQuery}
          query={picker.query}
        />
      )}
      title={intl.formatMessage(messages.title)}
      fullScreenTitle={intl.formatMessage(messages.fullScreenTitle, {
        name: productName,
      })}
      onChange={onChange}
    />
  );
};
ProductVariants.displayName = "ProductVariants";
export default ProductVariants;
