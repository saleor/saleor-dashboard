import { createIntl } from "react-intl";
import { stringify as stringifyQs } from "qs";

import { ProductListUrlFilters } from "@saleor/products/urls";
import {
  createFilterStructure,
  ProductStatus
} from "@saleor/products/components/ProductListPage";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { StockAvailability } from "@saleor/types/globalTypes";
import { categories } from "@saleor/categories/fixtures";
import { fetchMoreProps, searchPageProps } from "@saleor/fixtures";
import { collections } from "@saleor/collections/fixtures";
import { productTypes } from "@saleor/productTypes/fixtures";
import { attributes } from "@saleor/attributes/fixtures";
import { getFilterVariables, getFilterQueryParam } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: ProductListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: ProductListUrlFilters = {
      priceFrom: "10",
      priceTo: "20",
      status: true.toString(),
      stockStatus: StockAvailability.IN_STOCK
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(intl, {
    attributes: attributes.map(attr => ({
      active: false,
      choices: attr.values.map(val => ({
        label: val.name,
        value: val.slug
      })),
      name: attr.name,
      slug: attr.slug,
      value: [attr.values[0].slug, attr.values[2].slug]
    })),
    categories: {
      ...fetchMoreProps,
      ...searchPageProps,
      active: false,
      choices: categories.slice(5).map(category => ({
        label: category.name,
        value: category.id
      })),
      displayValues: [
        {
          label: categories[5].name,
          value: categories[5].id
        }
      ],
      value: [categories[5].id]
    },
    collections: {
      ...fetchMoreProps,
      ...searchPageProps,
      active: false,
      choices: collections.slice(5).map(category => ({
        label: category.name,
        value: category.id
      })),
      displayValues: [
        {
          label: collections[5].name,
          value: collections[5].id
        }
      ],
      value: [collections[5].id]
    },
    price: {
      active: false,
      value: {
        max: "20",
        min: "10"
      }
    },
    productType: {
      ...fetchMoreProps,
      ...searchPageProps,
      active: false,
      choices: productTypes.slice(3).map(category => ({
        label: category.name,
        value: category.id
      })),
      displayValues: [
        {
          label: productTypes[3].name,
          value: productTypes[3].id
        }
      ],
      value: [productTypes[4].id]
    },
    status: {
      active: false,
      value: ProductStatus.PUBLISHED
    },
    stockStatus: {
      active: false,
      value: StockAvailability.IN_STOCK
    }
  });

  it("should be empty if no active filters", () => {
    const filterQueryParams = getFilterQueryParams(
      filters,
      getFilterQueryParam
    );

    expect(getExistingKeys(filterQueryParams)).toHaveLength(0);
  });

  it("should not be empty if active filters are present", () => {
    const filterQueryParams = getFilterQueryParams(
      setFilterOptsStatus(filters, true),
      getFilterQueryParam
    );

    expect(filterQueryParams).toMatchSnapshot();
    expect(stringifyQs(filterQueryParams)).toMatchSnapshot();
  });
});
