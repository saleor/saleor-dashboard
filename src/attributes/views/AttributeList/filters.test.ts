import { createIntl } from "react-intl";
import { stringify as stringifyQs } from "qs";

import { AttributeListUrlFilters } from "@saleor/attributes/urls";
import { createFilterStructure } from "@saleor/attributes/components/AttributeListPage";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { config } from "@test/intl";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { getFilterVariables, getFilterQueryParam } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: AttributeListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: AttributeListUrlFilters = {
      availableInGrid: true.toString()
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(1);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(intl, {
    availableInGrid: {
      active: false,
      value: true
    },
    filterableInDashboard: {
      active: false,
      value: true
    },
    filterableInStorefront: {
      active: false,
      value: true
    },
    isVariantOnly: {
      active: false,
      value: true
    },
    valueRequired: {
      active: false,
      value: true
    },
    visibleInStorefront: {
      active: false,
      value: true
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
