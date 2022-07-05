import { Item } from "@glideapps/glide-data-grid";
import Datagrid, {
  GetCellContentOpts,
} from "@saleor/components/Datagrid/Datagrid";
import {
  AttributeInputTypeEnum,
  ChannelFragment,
  ProductDetailsVariantFragment,
  ProductFragment,
  RefreshLimitsQuery,
  WarehouseFragment,
} from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
// import { isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getColumnData, getData } from "./utils";

interface ProductVariantsProps {
  channels: ChannelFragment[];
  limits: RefreshLimitsQuery["shop"]["limits"];
  listings: ProductFragment["channelListings"];
  variantAttributes: ProductFragment["productType"]["variantAttributes"];
  variants: ProductDetailsVariantFragment[];
  warehouses: WarehouseFragment[];
  onVariantBulkDelete: (ids: string[]) => void;
  onRowClick: (id: string) => void;
  onSetDefaultVariant: (id: string) => void;
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  channels,
  listings,
  variants,
  warehouses,
  variantAttributes,
  onRowClick,
}) => {
  const intl = useIntl();
  // const limitReached = isLimitReached(limits, "productVariants");

  // Display only channels that product has listing in
  const availableChannels = React.useMemo(
    () => listings?.map(listing => channels.find(getById(listing.channel.id))),
    [channels, listings],
  );
  const columns = React.useMemo(
    () =>
      availableChannels && variantAttributes && warehouses
        ? [
            "name",
            "sku",
            ...availableChannels?.map(channel => `channel:${channel.id}`),
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
    [variantAttributes, warehouses, availableChannels],
  );

  const getCellContent = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getData({
        availableColumns: columns,
        channels,
        column,
        row,
        variants,
        ...opts,
      }),
    [columns, channels, variants],
  );

  return (
    <Datagrid
      availableColumns={columns}
      getCellContent={getCellContent}
      menuItems={index => [
        {
          label: "Edit Variant",
          onSelect: () => onRowClick(variants[index].id),
        },
      ]}
      rows={variants?.length ?? 0}
      selectionActions={(indexes, { removeRows }) => (
        <Button variant="tertiary" onClick={() => removeRows(indexes)}>
          <FormattedMessage {...buttonMessages.delete} />
        </Button>
      )}
    />
  );
};
ProductVariants.displayName = "ProductVariants";
export default ProductVariants;
