// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid, {
  GetCellContentOpts,
} from "@dashboard/components/Datagrid/Datagrid";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { Choice } from "@dashboard/components/SingleSelectField";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  RefreshLimitsQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import EditIcon from "@dashboard/icons/Edit";
import { buttonMessages } from "@dashboard/intl";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { ListViews } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
// import { isLimitReached } from "@dashboard/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  useAttributesAdapter,
  useChannelAdapter,
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
  variantAttributes,
  productName,
  onAttributeValuesSearch,
  onChange,
  onRowClick,
}) => {
  const intl = useIntl();

  const { updateListSettings, settings } = useListSettings(
    ListViews.PRODUCT_DETAILS,
  );
  const handleColumnChange = React.useCallback(
    picked => {
      updateListSettings("columns", picked.filter(Boolean));
    },
    [updateListSettings],
  );

  // const limitReached = isLimitReached(limits, "productVariants");

  const channelCategory = useChannelAdapter({
    intl,
    listings: channels,
    selectedColumns: settings?.columns ?? [],
  });

  const attributeCategory = useAttributesAdapter({
    intl,
    selectedColumns: settings?.columns ?? [],
    attributes: variantAttributes ?? [],
  });

  const warehouseCategory = useWarehouseAdapter({
    selectedColumns: settings?.columns ?? [],
    intl,
  });

  const memoizedStaticColumns = React.useMemo(
    () => variantsStaticColumnsAdapter(intl),
    [intl],
  );

  // console.log(channels);

  // const variantDefaultColumns = React.useMemo(
  //   () =>
  //     variantAttributes && warehouses && channels
  //       ? [
  //           "name",
  //           "sku",
  //           ...channels?.flatMap(channel => [
  //             `availableInChannel:${channel.id}`,
  //             `channel:${channel.id}`,
  //           ]),
  //           ...warehouses?.map(warehouse => `stock:${warehouse.id}`),
  //           ...variantAttributes
  //             .filter(attribute =>
  //               [
  //                 AttributeInputTypeEnum.DROPDOWN,
  //                 AttributeInputTypeEnum.PLAIN_TEXT,
  //               ].includes(attribute.inputType),
  //             )
  //             .map(attribute => `attribute:${attribute.id}`),
  //         ].map(c =>
  //           getColumnData(c, channels, warehouses, variantAttributes, intl),
  //         )
  //       : [],
  //   [variantAttributes, warehouses, channels, intl],
  // );

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
    columnCategories: [channelCategory, attributeCategory, warehouseCategory],
    selectedColumns: settings.columns,
    onSave: handleColumnChange,
  });

  // const {
  //   availableColumnsChoices,
  //   columnChoices,
  //   columns,
  //   defaultColumns,
  //   onColumnMoved,
  //   onColumnResize,
  //   onColumnsChange,
  //   picker,
  // } = useColumnsDefault(variantDefaultColumns);

  const visibleColumnsWithChannelAvailability = React.useMemo(
    () =>
      visibleColumns?.reduce((acc, col) => {
        const [prefix, id] = col.id.split(":");
        const isNewChannelColumn =
          prefix === "channel" &&
          !visibleColumns.find(c => c.id === `availableInChannel:${id}`);

        if (isNewChannelColumn) {
          const availabilityCol = {
            id: `availableInChannel:${col.id.split(":")[1]}`,
            title: intl.formatMessage(messages.available),
            width: 80,
            group: col.group,
          };
          acc.push(availabilityCol);
          const newCol = {
            ...col,
            title: intl.formatMessage(messages.price),
          };
          acc.push(newCol);
          return acc;
        }
        acc.push(col);
        return acc;
      }, []),
    [visibleColumns],
  );

  const getCellContent = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getData({
        availableColumns: visibleColumnsWithChannelAvailability,
        column,
        row,
        channels,
        variants,
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [
      channels,
      visibleColumnsWithChannelAvailability,
      onAttributeValuesSearch,
      variants,
    ],
  );

  const getCellError = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getError(errors, {
        availableColumns: visibleColumnsWithChannelAvailability,
        column,
        row,
        channels,
        variants,
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [
      errors,
      visibleColumnsWithChannelAvailability,
      channels,
      variants,
      onAttributeValuesSearch,
    ],
  );

  return (
    <Datagrid
      addButtonLabel={intl.formatMessage({
        defaultMessage: "Add variant",
        id: "3C3Nj5",
        description: "button",
      })}
      fillHandle={true}
      availableColumns={visibleColumnsWithChannelAvailability}
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
      onColumnResize={handlers.onResize}
      onColumnMoved={handlers.onMove}
      renderColumnPicker={() => (
        <ColumnPicker
          staticColumns={staticColumns}
          dynamicColumns={dynamicColumns}
          selectedColumns={selectedColumns}
          columnCategories={columnCategories}
          onToggle={handlers.onToggle}
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
