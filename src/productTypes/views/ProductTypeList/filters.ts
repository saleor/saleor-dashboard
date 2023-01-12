import { FilterElement } from "@dashboard/components/Filter";
import {
  ProductTypeConfigurable,
  ProductTypeEnum,
  ProductTypeFilterInput,
} from "@dashboard/graphql";
import { findValueInEnum, maybe } from "@dashboard/misc";
import {
  ProductTypeFilterKeys,
  ProductTypeListFilterOpts,
} from "@dashboard/productTypes/components/ProductTypeListPage";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  ProductTypeListUrlFilters,
  ProductTypeListUrlFiltersEnum,
  ProductTypeListUrlQueryParams,
} from "../../urls";

export const PRODUCT_TYPE_FILTERS_KEY = "productTypeFilters";

export function getFilterOpts(
  params: ProductTypeListUrlFilters,
): ProductTypeListFilterOpts {
  return {
    configurable: {
      active: !!maybe(() => params.configurable),
      value: maybe(() =>
        findValueInEnum(params.configurable, ProductTypeConfigurable),
      ),
    },
    type: {
      active: !!maybe(() => params.type),
      value: maybe(() => findValueInEnum(params.type, ProductTypeEnum)),
    },
  };
}

export function getFilterVariables(
  params: ProductTypeListUrlFilters,
): ProductTypeFilterInput {
  return {
    configurable: params.configurable
      ? findValueInEnum(params.configurable, ProductTypeConfigurable)
      : undefined,
    productType: params.type
      ? findValueInEnum(params.type, ProductTypeEnum)
      : undefined,
    search: params.query,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<ProductTypeFilterKeys>,
): ProductTypeListUrlFilters {
  const { name } = filter;

  switch (name) {
    case ProductTypeFilterKeys.configurable:
      return getSingleValueQueryParam(
        filter,
        ProductTypeListUrlFiltersEnum.configurable,
      );

    case ProductTypeFilterKeys.type:
      return getSingleValueQueryParam(
        filter,
        ProductTypeListUrlFiltersEnum.type,
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab,
} = createFilterTabUtils<ProductTypeListUrlFilters>(PRODUCT_TYPE_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab,
} = createFilterUtils<ProductTypeListUrlQueryParams, ProductTypeListUrlFilters>(
  ProductTypeListUrlFiltersEnum,
);
