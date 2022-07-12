import {
  getDefaultAttributeValues,
  getSelectedAttributeValues,
  mergeChoicesWithValues,
} from "@saleor/attributes/utils/data";
import { ChannelData } from "@saleor/channels/utils";
import {
  AttributeInput,
  VariantAttributeScope,
} from "@saleor/components/Attributes";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  ProductTypeQuery,
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
  SelectedVariantAttributeFragment,
  StockInput,
  VariantAttributeFragment,
} from "@saleor/graphql";
import { FormsetAtomicData } from "@saleor/hooks/useFormset";
import { maybe } from "@saleor/misc";
import { mapEdgesToItems, mapMetadataItemToInput } from "@saleor/utils/maps";
import moment from "moment";

import { ProductStockInput } from "../components/ProductStocks";
import { ChannelsWithVariantsData } from "../views/ProductUpdate/types";

export interface Collection {
  id: string;
  label: string;
}

interface Node {
  id: string;
  name: string;
}

export interface ProductType {
  hasVariants: boolean;
  id: string;
  name: string;
  productAttributes: ProductTypeQuery["productType"]["productAttributes"];
}

export function getAttributeInputFromProduct(
  product: ProductFragment,
): AttributeInput[] {
  return (
    product?.attributes?.map(attribute => ({
      data: {
        entityType: attribute.attribute.entityType,
        inputType: attribute.attribute.inputType,
        isRequired: attribute.attribute.valueRequired,
        selectedValues: attribute.values,
        values: mergeChoicesWithValues(attribute),
        unit: attribute.attribute.unit,
      },
      id: attribute.attribute.id,
      label: attribute.attribute.name,
      value: getSelectedAttributeValues(attribute),
    })) ?? []
  );
}

export function getAttributeInputFromProductType(
  productType: ProductType,
): AttributeInput[] {
  return productType.productAttributes.map(attribute => ({
    data: {
      entityType: attribute.entityType,
      inputType: attribute.inputType,
      isRequired: attribute.valueRequired,
      values: mapEdgesToItems(attribute.choices) || [],
      unit: attribute.unit,
    },
    id: attribute.id,
    label: attribute.name,
    value: [],
  }));
}

export function getAttributeInputFromAttributes(
  variantAttributes: VariantAttributeFragment[],
  variantAttributeScope: VariantAttributeScope,
): AttributeInput[] {
  return variantAttributes?.map(attribute => ({
    data: {
      entityType: attribute.entityType,
      inputType: attribute.inputType,
      isRequired: attribute.valueRequired,
      values: mapEdgesToItems(attribute.choices) || [],
      unit: attribute.unit,
      variantAttributeScope,
    },
    id: attribute.id,
    label: attribute.name,
    value: getDefaultAttributeValues(attribute),
  }));
}

export function getAttributeInputFromSelectedAttributes(
  variantAttributes: SelectedVariantAttributeFragment[],
  variantAttributeScope: VariantAttributeScope,
): AttributeInput[] {
  return variantAttributes?.map(attribute => ({
    data: {
      entityType: attribute.attribute.entityType,
      inputType: attribute.attribute.inputType,
      isRequired: attribute.attribute.valueRequired,
      selectedValues: attribute.values,
      values: mergeChoicesWithValues(attribute),
      unit: attribute.attribute.unit,
      variantAttributeScope,
    },
    id: attribute.attribute.id,
    label: attribute.attribute.name,
    value: getSelectedAttributeValues(attribute),
  }));
}

export function getAttributeInputFromVariant(
  variant: ProductVariantFragment,
): AttributeInput[] {
  const selectionAttributeInput = getAttributeInputFromSelectedAttributes(
    variant?.selectionAttributes,
    VariantAttributeScope.VARIANT_SELECTION,
  );
  const nonSelectionAttributeInput = getAttributeInputFromSelectedAttributes(
    variant?.nonSelectionAttributes,
    VariantAttributeScope.NOT_VARIANT_SELECTION,
  );

  return (
    selectionAttributeInput?.concat(nonSelectionAttributeInput ?? []) ?? []
  );
}

export function getVariantAttributeInputFromProduct(
  product: ProductVariantCreateDataQuery["product"],
): AttributeInput[] {
  const selectionAttributeInput = getAttributeInputFromAttributes(
    product?.productType?.selectionVariantAttributes,
    VariantAttributeScope.VARIANT_SELECTION,
  );

  const nonSelectionAttributeInput = getAttributeInputFromAttributes(
    product?.productType?.nonSelectionVariantAttributes,
    VariantAttributeScope.NOT_VARIANT_SELECTION,
  );

  return (
    selectionAttributeInput?.concat(nonSelectionAttributeInput ?? []) ?? []
  );
}

export function getStockInputFromVariant(
  variant: ProductVariantFragment,
): ProductStockInput[] {
  return (
    variant?.stocks.map(stock => ({
      data: {
        quantityAllocated: stock.quantityAllocated,
      },
      id: stock.warehouse.id,
      label: stock.warehouse.name,
      value: stock.quantity.toString(),
    })) || []
  );
}

export function getStockInputFromProduct(
  product: ProductFragment,
): ProductStockInput[] {
  return product?.variants[0]?.stocks.map(stock => ({
    data: {
      quantityAllocated: stock?.quantityAllocated,
    },
    id: stock.warehouse.id,
    label: stock.warehouse.name,
    value: stock.quantity.toString(),
  }));
}

export function getCollectionInput(
  productCollections: ProductFragment["collections"],
): Collection[] {
  return maybe(
    () =>
      productCollections.map(collection => ({
        id: collection.id,
        label: collection.name,
      })),
    [],
  );
}

export function getChoices(nodes: Node[]): SingleAutocompleteChoiceType[] {
  return maybe(
    () =>
      nodes.map(node => ({
        label: node.name,
        value: node.id,
      })),
    [],
  );
}

export interface ProductUpdatePageFormData extends MetadataFormData {
  category: string | null;
  changeTaxCode: boolean;
  channelsWithVariants: ChannelsWithVariantsData;
  channelListings: ChannelData[];
  channelsData: ChannelData[];
  chargeTaxes: boolean;
  collections: string[];
  isAvailable: boolean;
  name: string;
  slug: string;
  rating: number;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  taxCode: string;
  trackInventory: boolean;
  weight: string;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

export function getProductUpdatePageFormData(
  product: ProductFragment,
  variants: ProductDetailsVariantFragment[],
  currentChannels: ChannelData[],
  channelsData: ChannelData[],
  channelsWithVariants: ChannelsWithVariantsData,
): ProductUpdatePageFormData {
  const variant = product?.variants[0];
  return {
    channelsWithVariants,
    channelsData,
    category: maybe(() => product.category.id, ""),
    changeTaxCode: !!product?.taxType.taxCode,
    chargeTaxes: maybe(() => product.chargeTaxes, false),
    collections: maybe(
      () => product.collections.map(collection => collection.id),
      [],
    ),
    channelListings: currentChannels.map(listing => ({ ...listing })),
    isAvailable: !!product?.isAvailable,
    metadata: product?.metadata?.map(mapMetadataItemToInput),
    name: maybe(() => product.name, ""),
    privateMetadata: product?.privateMetadata?.map(mapMetadataItemToInput),
    rating: maybe(() => product.rating, null),
    seoDescription: maybe(() => product.seoDescription, ""),
    seoTitle: maybe(() => product.seoTitle, ""),
    sku: maybe(
      () =>
        product.productType.hasVariants
          ? undefined
          : variants && variants[0]
          ? variants[0].sku
          : undefined,
      "",
    ),
    slug: product?.slug || "",
    taxCode: product?.taxType.taxCode,
    trackInventory: !!variant?.trackInventory,
    weight: product?.weight?.value.toString() || "",
    isPreorder: !!variant?.preorder || false,
    globalThreshold: variant?.preorder?.globalThreshold?.toString() || "",
    globalSoldUnits: variant?.preorder?.globalSoldUnits || 0,
    hasPreorderEndDate: !!variant?.preorder?.endDate,
    preorderEndDateTime: variant?.preorder?.endDate,
  };
}

export function mapFormsetStockToStockInput(
  stock: FormsetAtomicData<null, string>,
): StockInput {
  return {
    quantity: parseInt(stock.value, 10) || 0,
    warehouse: stock.id,
  };
}

export const getPreorderEndDateFormData = (endDate?: string) =>
  endDate ? moment(endDate).format("YYYY-MM-DD") : "";

export const getPreorderEndHourFormData = (endDate?: string) =>
  endDate ? moment(endDate).format("HH:mm") : "";
