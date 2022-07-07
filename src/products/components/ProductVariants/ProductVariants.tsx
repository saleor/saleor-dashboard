import { Item } from "@glideapps/glide-data-grid";
import Datagrid, {
  GetCellContentOpts,
} from "@saleor/components/Datagrid/Datagrid";
import { DatagridChangeOpts } from "@saleor/components/Datagrid/useDatagridChange";
import {
  AttributeInputTypeEnum,
  ProductDetailsVariantFragment,
  ProductFragment,
  RefreshLimitsQuery,
  WarehouseFragment,
} from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
// import { isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getColumnData, getData } from "./utils";

interface ProductVariantsProps {
  limits: RefreshLimitsQuery["shop"]["limits"];
  variantAttributes: ProductFragment["productType"]["variantAttributes"];
  variants: ProductDetailsVariantFragment[];
  warehouses: WarehouseFragment[];
  onChange: (data: DatagridChangeOpts) => void;
  onRowClick: (id: string) => void;
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  variants,
  warehouses,
  variantAttributes,
  onChange,
  onRowClick,
}) => {
  const intl = useIntl();
  // const limitReached = isLimitReached(limits, "productVariants");

  const columns = React.useMemo(
    () =>
      variantAttributes && warehouses
        ? [
            "name",
            "sku",
            // ...channels?.map(channel => `channel:${channel.id}`),
            ...warehouses?.map(warehouse => `stock:${warehouse.id}`),
            ...variantAttributes
              .filter(attribute =>
                [
                  AttributeInputTypeEnum.DROPDOWN,
                  AttributeInputTypeEnum.PLAIN_TEXT,
                ].includes(attribute.inputType),
              )
              .map(attribute => `attribute:${attribute.id}`),
          ].map(c => getColumnData(c, warehouses, variantAttributes, intl))
        : [],
    [variantAttributes, warehouses],
  );

  const getCellContent = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getData({
        availableColumns: columns,
        column,
        row,
        variants,
        ...opts,
      }),
    [columns, variants],
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
      onChange={onChange}
    />
  );
};
ProductVariants.displayName = "ProductVariants";
export default ProductVariants;
