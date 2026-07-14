// @ts-strict-ignore
import { type ChannelData } from "@dashboard/channels/utils";
import { DatagridSwatchPreview } from "@dashboard/components/Attributes/DatagridSwatchPreview";
import { getAttributeSwatchData } from "@dashboard/components/Attributes/getAttributeSwatchData";
import {
  booleanCell,
  dropdownCell,
  moneyCell,
  numberCell,
  textCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { emptyDropdownCellValue } from "@dashboard/components/Datagrid/customCells/DropdownCell";
import { type AttributeSearchOption } from "@dashboard/components/Datagrid/customCells/DropdownCell";
import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { type DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import {
  AttributeInputTypeEnum,
  type ProductDetailsVariantFragment,
  type ProductFragment,
} from "@dashboard/graphql";
import { type ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { type GridCell } from "@glideapps/glide-data-grid";
import { type Option } from "@saleor/macaw-ui-next";
import { type MutableRefObject } from "react";

import {
  getColumnAttribute,
  getColumnChannel,
  getColumnChannelAvailability,
  getColumnName,
  getColumnStock,
} from "../../utils/datagrid";

function errorMatchesColumn(error: ProductVariantListError, columnId: string): boolean {
  if (error.type === "channel") {
    return (
      error.channelIds.includes(getColumnChannel(columnId)) ||
      error.channelIds.includes(getColumnChannelAvailability(columnId))
    );
  }

  if (error.type === "stock") {
    return error.warehouseId.includes(getColumnStock(columnId));
  }

  if (error.type === "variantData") {
    if (error.attributes?.length > 0) {
      return error.attributes.includes(getColumnAttribute(columnId));
    }

    return error?.field?.includes(getColumnName(columnId)) ?? false;
  }
}

export function getError(
  errors: ProductVariantListError[],
  { availableColumns, removed, column, row, variants }: GetDataOrError,
): boolean {
  if (column === -1) {
    return false;
  }

  const columnId = availableColumns[column]?.id;
  const variantId = variants[row + removed.filter(r => r <= row).length]?.id;

  if (!variantId) {
    return errors.some(err => err.type === "create" && err.index === row - variants.length);
  }

  return errors.some(
    err =>
      err.type !== "create" && err.variantId === variantId && errorMatchesColumn(err, columnId),
  );
}

interface GetDataOrError {
  availableColumns: AvailableColumn[];
  column: number;
  row: number;
  variants: ProductDetailsVariantFragment[];
  changes: MutableRefObject<DatagridChange[]>;
  channels: ChannelData[];
  added: number[];
  removed: number[];
  searchAttributeValues: (id: string, text: string) => Promise<Option[]>;
  getChangeIndex: (column: string, row: number) => number;
}

interface GetDataParams extends GetDataOrError {
  variantAttributes: ProductFragment["productType"]["variantAttributes"];
}

const enrichSwatchSearchOptions = (options: Option[]): AttributeSearchOption[] =>
  options.map(option => {
    const swatch = (option as AttributeSearchOption).swatch;

    if (!swatch) {
      return option;
    }

    return {
      ...option,
      startAdornment: <DatagridSwatchPreview {...swatch} />,
    };
  });

const getSwatchAttributeOption = (
  attributeValue: ProductDetailsVariantFragment["attributes"][number]["values"][number],
): AttributeSearchOption => ({
  label: attributeValue.name ?? "",
  value: attributeValue.slug ?? attributeValue.id,
  swatch: getAttributeSwatchData(attributeValue),
});

export function getData({
  availableColumns,
  changes,
  added,
  removed,
  column,
  getChangeIndex,
  row,
  channels,
  variants,
  variantAttributes,
  searchAttributeValues,
}: GetDataParams): GridCell {
  // For some reason it happens when user deselects channel
  if (column === -1) {
    return textCell("");
  }

  const columnId = availableColumns[column]?.id;
  const change = changes.current[getChangeIndex(columnId, row)]?.data;
  const dataRow = added.includes(row)
    ? undefined
    : variants.filter((_, index) => !removed.includes(index))[row];

  switch (columnId) {
    case "name":
    case "sku": {
      const value = change ?? (dataRow ? dataRow[columnId] : "");

      return textCell(value || "");
    }
  }

  if (getColumnStock(columnId)) {
    const value =
      change?.value ??
      dataRow?.stocks.find(stock => stock.warehouse.id === getColumnStock(columnId))?.quantity ??
      numberCellEmptyValue;

    return numberCell(value);
  }

  if (getColumnChannel(columnId)) {
    const channelId = getColumnChannel(columnId);
    const listing = dataRow?.channelListings.find(listing => listing.channel.id === channelId);
    const available =
      changes.current[getChangeIndex(`availableInChannel:${channelId}`, row)]?.data ?? !!listing;

    if (!available) {
      return {
        ...numberCell(numberCellEmptyValue, { hasFloatingPoint: true }),
        readonly: false,
        allowOverlay: false,
      };
    }

    const currency = channels.find(channel => channelId === channel.id)?.currency;
    const value = change?.value ?? listing?.price?.amount ?? 0;

    return moneyCell(value, currency);
  }

  if (getColumnChannelAvailability(columnId)) {
    const channelId = getColumnChannelAvailability(columnId);
    const listing = dataRow?.channelListings.find(listing => listing.channel.id === channelId);
    const value = change ?? !!listing;

    return booleanCell(value);
  }

  if (getColumnAttribute(columnId)) {
    const attributeId = getColumnAttribute(columnId);
    const attributeDefinition = variantAttributes?.find(attribute => attribute.id === attributeId);
    const isSwatchAttribute = attributeDefinition?.inputType === AttributeInputTypeEnum.SWATCH;
    const attributeValue = dataRow?.attributes.find(
      attribute => attribute.attribute.id === attributeId,
    )?.values?.[0];
    const initialValue: AttributeSearchOption = attributeValue
      ? isSwatchAttribute
        ? getSwatchAttributeOption(attributeValue)
        : mapNodeToChoice([attributeValue], node => node.slug ?? node.id)[0]
      : emptyDropdownCellValue;
    const cellValue = (change?.value as AttributeSearchOption | undefined) ?? initialValue;
    const swatch = isSwatchAttribute
      ? (cellValue.swatch ?? getAttributeSwatchData(attributeValue))
      : undefined;

    return dropdownCell(cellValue, {
      allowCustomValues: true,
      emptyOption: true,
      swatch,
      update: async text => {
        const options = await searchAttributeValues(attributeId, text);

        return isSwatchAttribute ? enrichSwatchSearchOptions(options) : options;
      },
    });
  }
}
