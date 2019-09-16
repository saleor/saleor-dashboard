import { defineMessages, IntlShape } from "react-intl";

import { FilterContentSubmitData } from "../../../components/Filter";
import { Filter } from "../../../components/TableFilter";
import {
  ProductFilterInput,
  StockAvailability
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import { ProductFilterKeys } from "../../components/ProductListFilter";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersEnum,
  ProductListUrlQueryParams
} from "../../urls";

export const PRODUCT_FILTERS_KEY = "productFilters";

export function getFilterVariables(
  params: ProductListUrlFilters
): ProductFilterInput {
  return {
    isPublished:
      params.isPublished !== undefined ? params.isPublished === "true" : null,
    price: {
      gte: parseFloat(params.priceFrom),
      lte: parseFloat(params.priceTo)
    },
    search: params.query,
    stockAvailability: StockAvailability[params.status]
  };
}

export function createFilter(
  filter: FilterContentSubmitData<ProductFilterKeys>
): ProductListUrlFilters {
  const filterName = filter.name;
  if (filterName === ProductFilterKeys.priceEqual) {
    const value = filter.value as string;
    return {
      priceFrom: value,
      priceTo: value
    };
  } else if (filterName === ProductFilterKeys.priceRange) {
    const { value } = filter;
    return {
      priceFrom: value[0],
      priceTo: value[1]
    };
  } else if (filterName === ProductFilterKeys.published) {
    return {
      isPublished: filter.value as string
    };
  } else if (filterName === ProductFilterKeys.stock) {
    const value = filter.value as string;
    return {
      status: StockAvailability[value]
    };
  }
}

const filterMessages = defineMessages({
  available: {
    defaultMessage: "Available",
    description: "filter products by stock"
  },
  hidden: {
    defaultMessage: "Hidden",
    description: "filter products by visibility"
  },
  outOfStock: {
    defaultMessage: "Out of stock",
    description: "filter products by stock"
  },
  priceFrom: {
    defaultMessage: "Price from {price}",
    description: "filter by price"
  },
  priceIs: {
    defaultMessage: "Price is {price}",
    description: "filter by price"
  },
  priceTo: {
    defaultMessage: "Price to {price}",
    description: "filter by price"
  },
  published: {
    defaultMessage: "Published",
    description: "filter products by visibility"
  }
});

interface ProductListChipFormatData {
  currencySymbol: string;
  locale: string;
}
export function createFilterChips(
  filters: ProductListUrlFilters,
  formatData: ProductListChipFormatData,
  onFilterDelete: (filters: ProductListUrlFilters) => void,
  intl: IntlShape
): Filter[] {
  let filterChips: Filter[] = [];

  if (!!filters.priceFrom || !!filters.priceTo) {
    if (filters.priceFrom === filters.priceTo) {
      filterChips = [
        ...filterChips,
        {
          label: intl.formatMessage(filterMessages.priceIs, {
            price: parseFloat(filters.priceFrom).toLocaleString(
              formatData.locale,
              {
                currency: formatData.currencySymbol,
                style: "currency"
              }
            )
          }),
          onClick: () =>
            onFilterDelete({
              ...filters,
              priceFrom: undefined,
              priceTo: undefined
            })
        }
      ];
    } else {
      if (!!filters.priceFrom) {
        filterChips = [
          ...filterChips,
          {
            label: intl.formatMessage(filterMessages.priceFrom, {
              price: parseFloat(filters.priceFrom).toLocaleString(
                formatData.locale,
                {
                  currency: formatData.currencySymbol,
                  style: "currency"
                }
              )
            }),
            onClick: () =>
              onFilterDelete({
                ...filters,
                priceFrom: undefined
              })
          }
        ];
      }

      if (!!filters.priceTo) {
        filterChips = [
          ...filterChips,
          {
            label: intl.formatMessage(filterMessages.priceTo, {
              price: parseFloat(filters.priceTo).toLocaleString(
                formatData.locale,
                {
                  currency: formatData.currencySymbol,
                  style: "currency"
                }
              )
            }),
            onClick: () =>
              onFilterDelete({
                ...filters,
                priceTo: undefined
              })
          }
        ];
      }
    }
  }

  if (!!filters.status) {
    filterChips = [
      ...filterChips,
      {
        label:
          filters.status === StockAvailability.IN_STOCK.toString()
            ? intl.formatMessage(filterMessages.available)
            : intl.formatMessage(filterMessages.outOfStock),
        onClick: () =>
          onFilterDelete({
            ...filters,
            status: undefined
          })
      }
    ];
  }

  if (!!filters.isPublished) {
    filterChips = [
      ...filterChips,
      {
        label: !!filters.isPublished
          ? intl.formatMessage(filterMessages.published)
          : intl.formatMessage(filterMessages.hidden),
        onClick: () =>
          onFilterDelete({
            ...filters,
            isPublished: undefined
          })
      }
    ];
  }

  return filterChips;
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ProductListUrlFilters>(PRODUCT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ProductListUrlQueryParams,
  ProductListUrlFilters
>(ProductListUrlFiltersEnum);
