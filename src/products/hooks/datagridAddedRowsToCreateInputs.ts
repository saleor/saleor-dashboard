import { type DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  type ProductVariantBulkCreateInput,
  type VariantAttributeFragment,
} from "@dashboard/graphql";
import { applyStagedCreateUpdate } from "@dashboard/products/components/ProductVariants/components/stagedCreatesDatagrid";
import { getColumnAttribute } from "@dashboard/products/utils/datagrid";
import { getAttributeData } from "@dashboard/products/views/ProductUpdate/handlers/data/attributes";
import { getNameData } from "@dashboard/products/views/ProductUpdate/handlers/data/name";
import { getSkuData } from "@dashboard/products/views/ProductUpdate/handlers/data/sku";

const isFilledString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const attributeHasValue = (
  attribute: NonNullable<ProductVariantBulkCreateInput["attributes"]>[number],
): boolean => {
  if (attribute.values?.some(value => Boolean(value))) {
    return true;
  }

  if (attribute.dropdown?.value || attribute.swatch?.value || attribute.plainText) {
    return true;
  }

  if (attribute.numeric || attribute.date || attribute.dateTime || attribute.file) {
    return true;
  }

  if (attribute.boolean === true || attribute.boolean === false) {
    return true;
  }

  if (attribute.reference || (attribute.references?.length ?? 0) > 0) {
    return true;
  }

  return false;
};

/**
 * Ghost / "Add variant" rows stay empty until the merchant types.
 * Those must not be staged or saved as new variants.
 */
export const isMeaningfulVariantCreateInput = (input: ProductVariantBulkCreateInput): boolean => {
  if (isFilledString(input.name) || isFilledString(input.sku)) {
    return true;
  }

  if ((input.attributes ?? []).some(attributeHasValue)) {
    return true;
  }

  if (
    (input.channelListings ?? []).some(
      listing => listing.price !== undefined && listing.price !== null && listing.price !== "",
    )
  ) {
    return true;
  }

  if ((input.stocks ?? []).some(stock => Number.isFinite(stock.quantity))) {
    return true;
  }

  return false;
};

/**
 * Turn page-local datagrid `added` rows (bulk-edit "Add variant") into
 * bulk-create inputs. Each added row is kept as its own create — do not
 * run these through attribute-signature dedupe, or empty drafts collapse
 * into a single variant.
 */
export const datagridAddedRowsToCreateInputs = (
  data: DatagridChangeOpts,
  variantAttributes: VariantAttributeFragment[] = [],
): ProductVariantBulkCreateInput[] =>
  data.added
    .map((rowIndex): ProductVariantBulkCreateInput => {
      const rowUpdates = data.updates.filter(update => update.row === rowIndex);
      const name = getNameData(rowUpdates, rowIndex);
      const sku = getSkuData(rowUpdates, rowIndex);
      const attributes = getAttributeData(rowUpdates, rowIndex, variantAttributes).filter(
        (attribute): attribute is NonNullable<typeof attribute> => Boolean(attribute),
      );
      const initial: ProductVariantBulkCreateInput = {
        attributes,
        ...(isFilledString(name) ? { name: name.trim() } : {}),
        ...(isFilledString(sku) ? { sku: sku.trim() } : {}),
      };

      return rowUpdates.reduce<ProductVariantBulkCreateInput>((create, update) => {
        if (
          update.column === "name" ||
          update.column === "sku" ||
          getColumnAttribute(update.column)
        ) {
          return create;
        }

        return applyStagedCreateUpdate(create, update);
      }, initial);
    })
    .filter(isMeaningfulVariantCreateInput);
