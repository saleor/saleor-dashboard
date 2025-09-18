// @ts-strict-ignore
import {
  getSelectedAttributeValues,
  mergeChoicesWithValues,
} from "@dashboard/attributes/utils/data";
import { AttributeInput, VariantAttributeScope } from "@dashboard/components/Attributes";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  ProductMediaFragment,
  ProductTypeQuery,
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
  SelectedVariantAttributeFragment,
  StockInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import { FormsetAtomicData } from "@dashboard/hooks/useFormset";
import { maybe } from "@dashboard/misc";
import { mapEdgesToItems, mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Option } from "@saleor/macaw-ui-next";
import moment from "moment";

import { ProductStockInput } from "../components/ProductStocks";
import { ProductUpdateFormData } from "../components/ProductUpdatePage/types";

/**
 * @interface Collection
 * @property {string} id - 集合的 ID。
 * @property {string} label - 集合的标签。
 *
 * 表示一个集合。
 */
export interface Collection {
  id: string;
  label: string;
}

/**
 * @interface Node
 * @property {string} id - 节点的 ID。
 * @property {string} name - 节点的名称。
 *
 * 表示一个带有 ID 和名称的通用节点。
 */
interface Node {
  id: string;
  name: string;
}

/**
 * @interface ProductType
 * @property {boolean} hasVariants - 产品类型是否有变体。
 * @property {string} id - 产品类型的 ID。
 * @property {string} name - 产品类型的名称。
 * @property {ProductTypeQuery["productType"]["productAttributes"]} productAttributes - 产品类型的属性。
 *
 * 表示一个产品类型。
 */
export interface ProductType {
  hasVariants: boolean;
  id: string;
  name: string;
  productAttributes: ProductTypeQuery["productType"]["productAttributes"];
}

/**
 * 从产品创建属性输入列表。
 *
 * @param {ProductFragment} product - 要从中创建属性输入的产品。
 * @returns {AttributeInput[]} 属性输入列表。
 */
export function getAttributeInputFromProduct(product: ProductFragment): AttributeInput[] {
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
      metadata: getReferenceAttributeValuesLabels(attribute),
    })) ?? []
  );
}

/**
 * @interface AttributeValuesMetadata
 * @property {string} value - 属性的值。
 * @property {string} label - 属性的标签。
 *
 * 表示属性值的元数据。
 */
export interface AttributeValuesMetadata {
  value: string;
  label: string;
}

const getReferenceAttributeValuesLabels = (
  attribute: ProductFragment["attributes"][0],
): AttributeValuesMetadata[] => {
  return attribute.values.map(value => {
    return {
      label: value.name,
      value: value.reference,
    };
  });
};

/**
 * 从产品类型创建属性输入列表。
 *
 * @param {ProductType} productType - 要从中创建属性输入的产品类型。
 * @returns {AttributeInput[]} 属性输入列表。
 */
export function getAttributeInputFromProductType(productType: ProductType): AttributeInput[] {
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

/**
 * 从变体属性列表创建属性输入列表。
 *
 * @param {VariantAttributeFragment[]} variantAttributes - 变体属性列表。
 * @param {VariantAttributeScope} variantAttributeScope - 变体属性的范围。
 * @returns {AttributeInput[]} 属性输入列表。
 */
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
    value: [],
  }));
}

/**
 * 从选定的变体属性列表创建属性输入列表。
 *
 * @param {SelectedVariantAttributeFragment[]} variantAttributes - 选定的变体属性列表。
 * @param {VariantAttributeScope} variantAttributeScope - 变体属性的范围。
 * @returns {AttributeInput[]} 属性输入列表。
 */
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

/**
 * 从变体创建属性输入列表。
 *
 * @param {ProductVariantFragment} variant - 要从中创建属性输入的变体。
 * @returns {AttributeInput[]} 属性输入列表。
 */
export function getAttributeInputFromVariant(variant: ProductVariantFragment): AttributeInput[] {
  const selectionAttributeInput = getAttributeInputFromSelectedAttributes(
    variant?.selectionAttributes,
    VariantAttributeScope.VARIANT_SELECTION,
  );
  const nonSelectionAttributeInput = getAttributeInputFromSelectedAttributes(
    variant?.nonSelectionAttributes,
    VariantAttributeScope.NOT_VARIANT_SELECTION,
  );

  return selectionAttributeInput?.concat(nonSelectionAttributeInput ?? []) ?? [];
}

/**
 * 从产品创建变体属性输入列表。
 *
 * @param {ProductVariantCreateDataQuery["product"]} product - 要从中创建变体属性输入的产品。
 * @returns {AttributeInput[]} 属性输入列表。
 */
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

  return selectionAttributeInput?.concat(nonSelectionAttributeInput ?? []) ?? [];
}

/**
 * 从变体创建库存输入列表。
 *
 * @param {ProductVariantFragment} variant - 要从中创建库存输入的变体。
 * @returns {ProductStockInput[]} 库存输入列表。
 */
export function getStockInputFromVariant(variant: ProductVariantFragment): ProductStockInput[] {
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

/**
 * 从产品集合列表创建集合输入列表。
 *
 * @param {ProductFragment["collections"]} productCollections - 产品集合列表。
 * @returns {Collection[]} 集合输入列表。
 */
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

/**
 * 从节点列表创建选项列表。
 *
 * @param {Node[]} nodes - 要从中创建选项的节点列表。
 * @returns {Option[]} 选项列表。
 */
export function getChoices(nodes: Node[]): Option[] {
  return maybe(
    () =>
      nodes.map(node => ({
        label: node.name,
        value: node.id,
      })),
    [],
  );
}

/**
 * 为产品更新页面创建表单数据。
 *
 * @param {ProductFragment} product - 要从中创建表单数据的产品。
 * @param {ProductDetailsVariantFragment[]} variants - 产品的变体。
 * @returns {ProductUpdateFormData} 产品更新页面的表单数据。
 */
export function getProductUpdatePageFormData(
  product: ProductFragment,
  variants: ProductDetailsVariantFragment[],
): ProductUpdateFormData {
  const variant = product?.variants[0];

  return {
    category: maybe(() => product.category.id, ""),
    taxClassId: product?.taxClass?.id,
    collections: maybe(
      () =>
        product.collections.map(collection => ({
          label: collection.name,
          value: collection.id,
        })),
      [],
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
      "",
    ),
    slug: product?.slug || "",
    trackInventory: !!variant?.trackInventory,
    weight: product?.weight?.value.toString() || "",
    isPreorder: !!variant?.preorder || false,
    globalThreshold: variant?.preorder?.globalThreshold?.toString() || "",
    globalSoldUnits: variant?.preorder?.globalSoldUnits || 0,
    hasPreorderEndDate: !!variant?.preorder?.endDate,
    preorderEndDateTime: variant?.preorder?.endDate,
  };
}

/**
 * 将表单集库存映射到库存输入。
 *
 * @param {FormsetAtomicData<null, string>} stock - 要映射的表单集库存。
 * @returns {StockInput} 映射的库存输入。
 */
export function mapFormsetStockToStockInput(stock: FormsetAtomicData<null, string>): StockInput {
  return {
    quantity: parseInt(stock.value, 10) || 0,
    warehouse: stock.id,
  };
}

/**
 * 从结束日期字符串获取预购结束日期表单数据。
 *
 * @param {string} [endDate] - 结束日期字符串。
 * @returns {string} 预购结束日期表单数据。
 */
export const getPreorderEndDateFormData = (endDate?: string) =>
  endDate ? moment(endDate).format("YYYY-MM-DD") : "";

/**
 * 从结束日期字符串获取预购结束小时表单数据。
 *
 * @param {string} [endDate] - 结束日期字符串。
 * @returns {string} 预购结束小时表单数据。
 */
export const getPreorderEndHourFormData = (endDate?: string) =>
  endDate ? moment(endDate).format("HH:mm") : "";

/**
 * 从媒体列表和选定媒体 ID 列表中获取选定的媒体。
 *
 * @template T
 * @param {T[]} [media=[]] - 媒体列表。
 * @param {string[]} selectedMediaIds - 选定媒体 ID 列表。
 * @returns {T[]} 选定的媒体。
 */
export const getSelectedMedia = <T extends Pick<ProductMediaFragment, "id" | "sortOrder">>(
  media: T[] = [],
  selectedMediaIds: string[],
) =>
  media
    .filter(image => selectedMediaIds.includes(image.id))
    .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1));
