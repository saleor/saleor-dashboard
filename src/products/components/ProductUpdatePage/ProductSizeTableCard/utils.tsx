// @ts-strict-ignore
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ProductDetailsVariantFragment, ProductFragment } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

import messages from "./messages";
import { ClothingSize, ProductSizeTableError, SizePropertyEnum, TSizeTable } from "./types";

export const mapSizeTableToOptions = (sizeTable: TSizeTable, intl: IntlShape): Option[] => {
  if (Object.keys(sizeTable).length === 0) {
    return [];
  }

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

export function getError(
  errors: ProductSizeTableError[],
  { availableColumns, removed, column, row, sizes }: GetDataOrError,
): boolean {
  if (column === -1) {
    return false;
  }

  const columnId = availableColumns[column]?.id;
  const size = sizes[row + removed.filter(r => r <= row).length];

  return errors.some(err => err.size === size && err.field === columnId); // check if error matches row and column
}

interface GetDataOrError {
  availableColumns: AvailableColumn[];
  column: number;
  row: number;
  sizes: ClothingSize[];
  removed: number[];
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
            acc[property] = null;
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
          attr => attr.attribute.name.toLowerCase() === "size",
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

export const getSizeTableFromProductMetadata = (product: ProductFragment): TSizeTable => {
  const sizeTableString = product?.metadata.find(meta => meta.key === "sizeTable")?.value;

  if (!sizeTableString) {
    return {};
  }

  try {
    const sizeTable = JSON.parse(sizeTableString) as TSizeTable;

    return sizeTable;
  } catch (error) {
    console.error("Failed to parse size table from metadata:", error);

    return {};
  }
};

export const getInitialSizeTable = (
  product: ProductFragment,
  sizeProperties: Option[],
  sizeTableFromMetadata: TSizeTable,
) => {
  if (!product || !product.variants) {
    return {};
  }

  const productVariants = product.variants;
  const sizes = getProductVariantClothingSizes(productVariants);
  const sizeTable = generateSizeTable(sizeTableFromMetadata, sizes, sizeProperties);

  return sizeTable;
};
