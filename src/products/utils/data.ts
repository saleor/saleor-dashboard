import { MetadataFormData } from "@saleor/components/Metadata/types";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import { FormsetAtomicData } from "@saleor/hooks/useFormset";
import { maybe } from "@saleor/misc";
import {
  ProductDetails_product,
  ProductDetails_product_collections,
  ProductDetails_product_variants
} from "@saleor/products/types/ProductDetails";
import { SearchProductTypes_search_edges_node_productAttributes } from "@saleor/searches/types/SearchProductTypes";
import { StockInput } from "@saleor/types/globalTypes";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import { RawDraftContentState } from "draft-js";

import { ProductAttributeInput } from "../components/ProductAttributes";
import { ProductStockInput } from "../components/ProductStocks";
import { VariantAttributeInput } from "../components/ProductVariantAttributes";
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
): ProductAttributeInput[] {
  return maybe(
    (): ProductAttributeInput[] =>
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
): ProductAttributeInput[] {
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
): VariantAttributeInput[] {
  return maybe(
    (): VariantAttributeInput[] =>
      variant.attributes.map(attribute => ({
        data: {
          isRequired: attribute.attribute.valueRequired,
          values: attribute.attribute.values
        },
        id: attribute.attribute.id,
        label: attribute.attribute.name,
        value: maybe(() => attribute.values[0].slug, null)
      })),
    []
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
): VariantAttributeInput[] {
  return maybe(() =>
    product.productType.variantAttributes.map(attribute => ({
      data: {
        isRequired: attribute.valueRequired,
        values: attribute.values
      },
      id: attribute.id,
      label: attribute.name,
      value: ""
    }))
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

export interface ProductUpdatePageFormData extends MetadataFormData {
  availableForPurchase: string;
  basePrice: number;
  category: string | null;
  collections: string[];
  chargeTaxes: boolean;
  description: RawDraftContentState;
  isAvailableForPurchase: boolean;
  isAvailable: boolean;
  isPublished: boolean;
  name: string;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  trackInventory: boolean;
  weight: string;
  visibleInListings: boolean;
}

export function getProductUpdatePageFormData(
  product: ProductDetails_product,
  variants: ProductDetails_product_variants[]
): ProductUpdatePageFormData {
  return {
    availableForPurchase: product?.availableForPurchase,
    basePrice: maybe(() => product.variants[0].price.amount, 0),
    category: maybe(() => product.category.id, ""),
    chargeTaxes: maybe(() => product.chargeTaxes, false),
    collections: maybe(
      () => product.collections.map(collection => collection.id),
      []
    ),
    description: maybe(() => JSON.parse(product.descriptionJson)),
    isAvailable: !!product?.isAvailable,
    isAvailableForPurchase: !!product?.isAvailableForPurchase,
    isPublished: maybe(() => product.isPublished, false),
    metadata: product?.metadata?.map(mapMetadataItemToInput),
    name: maybe(() => product.name, ""),
    privateMetadata: product?.privateMetadata?.map(mapMetadataItemToInput),
    publicationDate: maybe(() => product.publicationDate, ""),
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
    trackInventory: !!product?.variants[0]?.trackInventory,
    visibleInListings: !!product?.visibleInListings,
    weight: product?.weight?.value.toString() || ""
  };
}

export function mapFormsetStockToStockInput(
  stock: FormsetAtomicData<null, string>
): StockInput {
  return {
    quantity: parseInt(stock.value, 10),
    warehouse: stock.id
  };
}
