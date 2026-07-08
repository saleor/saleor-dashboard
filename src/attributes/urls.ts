import { Condition } from "@dashboard/components/ConditionalFilter/FilterElement/Condition";
import {
  type ConditionItem,
  ConditionOptions,
} from "@dashboard/components/ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionSelected";
import {
  ExpressionValue,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";
import { prepareStructure } from "@dashboard/components/ConditionalFilter/ValueProvider/utils";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { stringifyQs } from "@dashboard/utils/urls";
import { stringify } from "qs";
import urlJoin from "url-join";

import {
  type ActiveTab,
  type BulkAction,
  type Dialog,
  type Filters,
  type FiltersWithMultipleValues,
  type Pagination,
  type SingleAction,
  type Sort,
  type TabActionDialog,
} from "../types";

export const attributeSection = "/attributes/";

export enum AttributeListUrlFiltersEnum {
  filterableInStorefront = "filterableInStorefront",
  isVariantOnly = "isVariantOnly",
  valueRequired = "valueRequired",
  visibleInStorefront = "visibleInStorefront",
  query = "query",
}
export type AttributeListUrlFilters = Filters<AttributeListUrlFiltersEnum>;

enum AttributeListUrlFiltersWithMultipleValues {
  typeIds = "typeIds",
  pageTypes = "pageTypes",
}

export type AttributeListUrlDialog = "remove" | "unassign" | TabActionDialog;
export enum AttributeListUrlSortField {
  name = "name",
  slug = "slug",
  visible = "visible",
  useInFacetedSearch = "use-in-faceted-search",
}
type AttributeListUrlSort = Sort<AttributeListUrlSortField>;
export type AttributeListUrlQueryParams = ActiveTab &
  AttributeListUrlFilters &
  FiltersWithMultipleValues<AttributeListUrlFiltersWithMultipleValues> &
  AttributeListUrlSort &
  BulkAction &
  Dialog<AttributeListUrlDialog> &
  Pagination;
export const attributeListPath = attributeSection;
export const attributeListUrl = (params?: AttributeListUrlQueryParams) =>
  attributeListPath + "?" + stringifyQs(params);

/**
 * Updates attribute list type-tab selection in URL params.
 * Always clears legacy `pageTypes` so bookmarks cannot re-apply a stale tab.
 */
export const withAttributeListTypeTabSelection = (
  params: AttributeListUrlQueryParams,
  typeIds: string[] | undefined,
): AttributeListUrlQueryParams => ({
  ...params,
  typeIds: typeIds?.length ? typeIds : undefined,
  pageTypes: undefined,
});

const createAttributeTypeFilterElement = (attributeType: AttributeTypeEnum): FilterElement => {
  const expressionValue = new ExpressionValue("attributeType", "Type", "attributeType");
  const conditionOptions = ConditionOptions.fromStaticElementName("attributeType");
  const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
  const conditionSelected = ConditionSelected.fromConditionItemAndValue(
    conditionItem,
    attributeType,
  );
  const condition = new Condition(conditionOptions, conditionSelected, false);

  return new FilterElement(expressionValue, condition, false);
};

/**
 * Builds the attribute list URL pre-filtered by a single attribute class.
 */
export const attributeListUrlWithAttributeType = (attributeType?: AttributeTypeEnum) => {
  if (!attributeType) {
    return attributeListPath;
  }

  const filterContainer = [createAttributeTypeFilterElement(attributeType)];
  const queryParams = prepareStructure(filterContainer);

  return urlJoin(attributeListPath, "?" + stringify(queryParams));
};

const builtInAttributeTypePresetTabIndex: Record<AttributeTypeEnum, number> = {
  [AttributeTypeEnum.PRODUCT_TYPE]: 1,
  [AttributeTypeEnum.PAGE_TYPE]: 2,
};

export const getAttributeTypeFromBuiltInPresetTab = (
  activeTab: number | undefined,
): AttributeTypeEnum | undefined => {
  if (!activeTab) {
    return undefined;
  }

  return (
    Object.entries(builtInAttributeTypePresetTabIndex) as Array<[AttributeTypeEnum, number]>
  ).find(([, tabIndex]) => tabIndex === activeTab)?.[0];
};

/**
 * Builds the attribute list URL for a built-in attribute class preset.
 */
export const attributeListUrlWithAttributeTypePreset = (attributeType: AttributeTypeEnum) =>
  `${attributeListUrlWithAttributeType(attributeType)}&activeTab=${builtInAttributeTypePresetTabIndex[attributeType]}`;

export type AttributeAddUrlDialog =
  | "add-value"
  | "edit-value"
  | "remove-value"
  | "remove-values"
  | "assign-reference-types";
export type AttributeAddUrlQueryParams = Dialog<AttributeAddUrlDialog> &
  SingleAction & {
    type?: AttributeTypeEnum;
  };

const attributeTypeValues = new Set<string>(Object.values(AttributeTypeEnum));

export const parseAttributeTypeFromQueryParam = (
  value: string | undefined,
): AttributeTypeEnum | undefined => {
  if (value && attributeTypeValues.has(value)) {
    return value as AttributeTypeEnum;
  }

  return undefined;
};
export const attributeAddPath = urlJoin(attributeSection, "add");
export const attributeAddUrl = (params?: AttributeAddUrlQueryParams) =>
  attributeAddPath + "?" + stringifyQs(params);

export type AttributeUrlDialog =
  | "add-value"
  | "edit-value"
  | "remove"
  | "remove-value"
  | "remove-values"
  | "assign-reference-types"
  | "view-metadata";
export type AttributeUrlQueryParams = BulkAction & Dialog<AttributeUrlDialog> & SingleAction;
export const attributePath = (id: string) => urlJoin(attributeSection, id);
export const attributeUrl = (id: string, params?: AttributeUrlQueryParams) =>
  attributePath(encodeURIComponent(id)) + "?" + stringifyQs(params);
