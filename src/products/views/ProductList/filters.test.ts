import { createFilterStructure } from "@saleor/products/components/ProductListPage";
import { ProductListUrlFilters } from "@saleor/products/urls";
import { StockAvailability } from "@saleor/types/globalTypes";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { stringify as stringifyQs } from "qs";
import { createIntl } from "react-intl";

import { getFilterQueryParam, getFilterVariables } from "./filters";
import { productListFilterOpts } from "./fixtures";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: ProductListUrlFilters = {};
    const filterVariables = getFilterVariables(params, undefined);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: ProductListUrlFilters = {
      priceFrom: "10",
      priceTo: "20",
      status: true.toString(),
      stockStatus: StockAvailability.IN_STOCK
    };
    const filterVariables = getFilterVariables(params, "default-channel");

    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(intl, productListFilterOpts);

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
