import { Item } from "@glideapps/glide-data-grid";
import { ChannelData } from "@saleor/channels/utils";
import Datagrid, {
  GetCellContentOpts,
} from "@saleor/components/Datagrid/Datagrid";
import { DatagridChangeOpts } from "@saleor/components/Datagrid/useDatagridChange";
import { Choice } from "@saleor/components/SingleSelectField";
import {
  AttributeInputTypeEnum,
  ProductDetailsVariantFragment,
  ProductFragment,
  RefreshLimitsQuery,
  WarehouseFragment,
} from "@saleor/graphql";
import EditIcon from "@saleor/icons/Edit";
import { buttonMessages } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import { ProductVariantListError } from "@saleor/products/views/ProductUpdate/handlers/errors";
// import { isLimitReached } from "@saleor/utils/limits";
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

  const columns = React.useMemo(
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
    [variantAttributes, warehouses, channels],
  );

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
    [columns, variants],
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
    [columns, variants, errors],
  );

  return (
    <Datagrid
      addButtonLabel={intl.formatMessage({
        defaultMessage: "Add variant",
        id: "3C3Nj5",
        description: "button",
      })}
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
