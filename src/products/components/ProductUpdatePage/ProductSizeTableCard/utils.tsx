// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ProductDetailsVariantFragment } from "@dashboard/graphql";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { Option } from "@saleor/macaw-ui-next";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";

import messages from "./messages";
import { ClothingSize, TSizeTable } from "./ProductSizeTableCard";
import { SizePropertyEnum } from "./types";

export const mapSizeTableToOptions = (sizeTable: TSizeTable, intl: IntlShape) => {
  const options = Object.keys(Object.values(sizeTable)[0]).flatMap(sizeProperty => {
    if (!(sizeProperty in SizePropertyEnum)) return [];

    const option: Option = {
      label: mapSizePropertyToMessage(sizeProperty as SizePropertyEnum, intl),
      value: sizeProperty,
    };

    return option;
  });

  return options;
};

export const mapSizePropertyToMessage = (sizeProperty: SizePropertyEnum, intl: IntlShape) => {
  switch (sizeProperty) {
    case SizePropertyEnum.WAIST_CIRCUMFERENCE:
      return intl.formatMessage(messages.dimensionWaist);
    case SizePropertyEnum.CHEST_CIRCUMFERENCE:
      return intl.formatMessage(messages.diemensionChest);
    case SizePropertyEnum.HIPS_CIRCUMFERENCE:
      return intl.formatMessage(messages.dimensionHips);
    case SizePropertyEnum.LENGTH:
      return intl.formatMessage(messages.dimensionLength);
    default:
      throw new Error("Invalid size property");
  }
};

function errorMatchesColumn(_error: ProductVariantListError, _columnId: string): boolean {
  return false;
  // if (error.type === "channel") {
  //   return (
  //     error.channelIds.includes(getColumnChannel(columnId)) ||
  //     error.channelIds.includes(getColumnChannelAvailability(columnId))
  //   );
  // }

  // if (error.type === "stock") {
  //   return error.warehouseId.includes(getColumnStock(columnId));
  // }

  // if (error.type === "variantData") {
  //   if (error.attributes?.length > 0) {
  //     return error.attributes.includes(getColumnAttribute(columnId));
  //   }

  //   return error?.field?.includes(getColumnName(columnId)) ?? false;
  // }
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

export const generateSizeTable = (
  initSizeTable: TSizeTable,
  sizes: ClothingSize[],
  sizeProperties: Option[],
) => {
  const sizePropertiesList = sizeProperties.map(property => property.value) as SizePropertyEnum[];

  const sizeTable: TSizeTable = {
    ...Object.keys(ClothingSize).reduce((acc, size) => {
      // if size in sizes spoecified by user in product variants assign emptySizeTableRow else it's udnefined
      const isSizeIncluded = sizes.includes(size as ClothingSize);
      const initTableRow = sizePropertiesList.reduce(
        (acc, property) => {
          if (
            sizePropertiesList.includes(property as SizePropertyEnum) &&
            initSizeTable?.[size]?.[property]
          ) {
            acc[property] = initSizeTable[size][property];
          } else {
            acc[property] = undefined;
          }

          return acc;
        },
        {} as Record<string, number>,
      );

      acc[size] = isSizeIncluded ? initTableRow : undefined;

      return acc;
    }, {} as TSizeTable),
  };

  return sizeTable;
};

export const getProductVariantClothingSizes = (
  productVariants?: ProductDetailsVariantFragment[],
) => {
  const sizes = Array.from(
    new Set(
      productVariants?.map(variant => {
        const sizeSlug = variant.attributes.find(
          attr => attr.attribute.name.toLowerCase() === "rozmiar",
        )?.values[0].slug;
        const size = sizeSlug ? sizeSlug : "unknown";

        return size;
      }),
    ),
  )
    .filter(size => size in ClothingSize)
    .sort(
      (a, b) => Object.keys(ClothingSize).indexOf(a) - Object.keys(ClothingSize).indexOf(b),
    ) as ClothingSize[];

  return sizes;
};
