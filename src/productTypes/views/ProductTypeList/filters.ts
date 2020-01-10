import {
  ProductTypeFilterInput,
  ProductTypeConfigurable,
  ProductTypeEnum
} from "@saleor/types/globalTypes";
import { IFilterElement } from "@saleor/components/Filter";
import { maybe, findValueInEnum } from "@saleor/misc";
import { ProductTypeFilterKeys } from "@saleor/productTypes/components/ProductTypeListPage";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  ProductTypeListUrlFilters,
  ProductTypeListUrlFiltersEnum,
  ProductTypeListUrlQueryParams
} from "../../urls";
import { ProductTypeListFilterOpts } from "../../types";

export const PRODUCT_TYPE_FILTERS_KEY = "productTypeFilters";

export function getFilterOpts(
  params: ProductTypeListUrlFilters
): ProductTypeListFilterOpts {
  return {
    configurable: {
      active: !!maybe(() => params.configurable),
      value: maybe(() =>
        findValueInEnum(params.configurable, ProductTypeConfigurable)
      )
    },
    type: {
      active: !!maybe(() => params.type),
      value: maybe(() => findValueInEnum(params.type, ProductTypeEnum))
    }
  };
}

export function getFilterVariables(
  params: ProductTypeListUrlFilters
): ProductTypeFilterInput {
  return {
    configurable: params.configurable
      ? findValueInEnum(params.configurable, ProductTypeConfigurable)
      : undefined,
    productType: params.type
      ? findValueInEnum(params.type, ProductTypeEnum)
      : undefined,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<ProductTypeFilterKeys>
): ProductTypeListUrlFilters {
  const { active, name, value } = filter;

  switch (name) {
    case ProductTypeFilterKeys.configurable:
      if (!active) {
        return {
          configurable: undefined
        };
      }

      return {
        configurable: value[0]
      };

    case ProductTypeFilterKeys.type:
      if (!active) {
        return {
          type: undefined
        };
      }

      return {
        type: value[0]
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ProductTypeListUrlFilters>(PRODUCT_TYPE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ProductTypeListUrlQueryParams,
  ProductTypeListUrlFilters
>(ProductTypeListUrlFiltersEnum);
