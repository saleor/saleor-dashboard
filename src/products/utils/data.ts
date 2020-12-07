import { ChannelData } from "@saleor/channels/utils";
import {
  AttributeInput,
  VariantAttributeScope
} from "@saleor/components/Attributes";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import { FormsetAtomicData, FormsetData } from "@saleor/hooks/useFormset";
import { maybe } from "@saleor/misc";
import {
  ProductDetails_product,
  ProductDetails_product_collections,
  ProductDetails_product_variants
} from "@saleor/products/types/ProductDetails";
import { SearchProductTypes_search_edges_node_productAttributes } from "@saleor/searches/types/SearchProductTypes";
import { StockInput } from "@saleor/types/globalTypes";
import { mapMetadataItemToInput } from "@saleor/utils/maps";

import { ProductStockInput } from "../components/ProductStocks";
import { ProductVariantCreateData_product } from "../types/ProductVariantCreateData";

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
  productAttributes: SearchProductTypes_search_edges_node_productAttributes[];
}

export function getAttributeInputFromProduct(
  product: ProductDetails_product
): AttributeInput[] {
  return maybe(
    (): AttributeInput[] =>
      product.attributes.map(attribute => ({
        data: {
          inputType: attribute.attribute.inputType,
          isRequired: attribute.attribute.valueRequired,
          values: attribute.attribute.values
        },
        id: attribute.attribute.id,
        label: attribute.attribute.name,
        value: attribute.values.map(value => value.slug)
      })),
    []
  );
}

export interface ProductAttributeValueChoices {
  id: string;
  values: MultiAutocompleteChoiceType[];
}
export function getSelectedAttributesFromProduct(
  product: ProductDetails_product
): ProductAttributeValueChoices[] {
  return maybe(
    () =>
      product.attributes.map(attribute => ({
        id: attribute.attribute.id,
        values: attribute.values.map(value => ({
          label: value.name,
          value: value.slug
        }))
      })),
    []
  );
}

export function getAttributeInputFromProductType(
  productType: ProductType
): AttributeInput[] {
  return productType.productAttributes.map(attribute => ({
    data: {
      inputType: attribute.inputType,
      isRequired: attribute.valueRequired,
      values: attribute.values
    },
    id: attribute.id,
    label: attribute.name,
    value: []
  }));
}

export function getAttributeInputFromVariant(
  variant: ProductVariant
): AttributeInput[] {
  const selectionAttributeInput = variant?.selectionAttributes?.map(
    attribute => ({
      data: {
        inputType: attribute.attribute.inputType,
        isRequired: attribute.attribute.valueRequired,
        values: attribute.attribute.values,
        variantAttributeScope: VariantAttributeScope.VARIANT_SELECTION
      },
      id: attribute.attribute.id,
      label: attribute.attribute.name,
      value: [(attribute.values.length && attribute.values[0]?.slug) || null]
    })
  );

  const notSelectionAttributeInput = variant?.notSelectionAttributes?.map(
    attribute => ({
      data: {
        inputType: attribute.attribute.inputType,
        isRequired: attribute.attribute.valueRequired,
        values: attribute.attribute.values,
        variantAttributeScope: VariantAttributeScope.NOT_VARIANT_SELECTION
      },
      id: attribute.attribute.id,
      label: attribute.attribute.name,
      value: [(attribute.values.length && attribute.values[0]?.slug) || null]
    })
  );

  return (
    selectionAttributeInput?.concat(notSelectionAttributeInput ?? []) ?? []
  );
}

export function getStockInputFromVariant(
  variant: ProductVariant
): ProductStockInput[] {
  return (
    variant?.stocks.map(stock => ({
      data: null,
      id: stock.warehouse.id,
      label: stock.warehouse.name,
      value: stock.quantity.toString()
    })) || []
  );
}

export function getVariantAttributeInputFromProduct(
  product: ProductVariantCreateData_product
): AttributeInput[] {
  const selectionAttributeInput = product?.productType?.selectionVariantAttributes?.map(
    attribute => ({
      data: {
        inputType: attribute.inputType,
        isRequired: attribute.valueRequired,
        values: attribute.values,
        variantAttributeScope: VariantAttributeScope.VARIANT_SELECTION
      },
      id: attribute.id,
      label: attribute.name,
      value: [""]
    })
  );

  const notSelectionAttributeInput = product?.productType?.notSelectionVariantAttributes?.map(
    attribute => ({
      data: {
        inputType: attribute.inputType,
        isRequired: attribute.valueRequired,
        values: attribute.values,
        variantAttributeScope: VariantAttributeScope.NOT_VARIANT_SELECTION
      },
      id: attribute.id,
      label: attribute.name,
      value: [""]
    })
  );

  return (
    selectionAttributeInput?.concat(notSelectionAttributeInput ?? []) ?? []
  );
}

export function getStockInputFromProduct(
  product: ProductDetails_product
): ProductStockInput[] {
  return product?.variants[0]?.stocks.map(stock => ({
    data: null,
    id: stock.warehouse.id,
    label: stock.warehouse.name,
    value: stock.quantity.toString()
  }));
}

export function getCollectionInput(
  productCollections: ProductDetails_product_collections[]
): Collection[] {
  return maybe(
    () =>
      productCollections.map(collection => ({
        id: collection.id,
        label: collection.name
      })),
    []
  );
}

export function getChoices(nodes: Node[]): SingleAutocompleteChoiceType[] {
  return maybe(
    () =>
      nodes.map(node => ({
        label: node.name,
        value: node.id
      })),
    []
  );
}

export const getAttributesDisplayData = (
  attributes: AttributeInput[],
  attributesWithNewFileValue: FormsetData<null, File>
) =>
  attributes.map(attribute => {
    const attributeWithNewFileValue = attributesWithNewFileValue.find(
      attributeWithNewFile => attribute.id === attributeWithNewFile.id
    );

    if (attributeWithNewFileValue) {
      return {
        ...attribute,
        value: [attributeWithNewFileValue.value.name]
      };
    }
    return attribute;
  });

export interface ProductUpdatePageFormData extends MetadataFormData {
  category: string | null;
  changeTaxCode: boolean;
  channelListings: ChannelData[];
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
}

export function getProductUpdatePageFormData(
  product: ProductDetails_product,
  variants: ProductDetails_product_variants[],
  currentChannels: ChannelData[]
): ProductUpdatePageFormData {
  return {
    category: maybe(() => product.category.id, ""),
    changeTaxCode: !!product?.taxType.taxCode,
    channelListings: currentChannels,
    chargeTaxes: maybe(() => product.chargeTaxes, false),
    collections: maybe(
      () => product.collections.map(collection => collection.id),
      []
    ),
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
      ""
    ),
    slug: product?.slug || "",
    taxCode: product?.taxType.taxCode,
    trackInventory: !!product?.variants[0]?.trackInventory,
    weight: product?.weight?.value.toString() || ""
  };
}

export function mapFormsetStockToStockInput(
  stock: FormsetAtomicData<null, string>
): StockInput {
  return {
    quantity: parseInt(stock.value, 10) || 0,
    warehouse: stock.id
  };
}
