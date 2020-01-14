import { createIntl } from "react-intl";
import { stringify as stringifyQs } from "qs";

import { CustomerListUrlFilters } from "@saleor/customers/urls";
import { createFilterStructure } from "@saleor/customers/components/CustomerListPage";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { date } from "@saleor/fixtures";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { getFilterVariables, getFilterQueryParam } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: CustomerListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: CustomerListUrlFilters = {
      joinedFrom: date.from,
      moneySpentFrom: "2",
      moneySpentTo: "39.50",
      numberOfOrdersTo: "5"
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(intl, {
    joined: {
      active: false,
      value: {
        max: date.to,
        min: date.from
      }
    },
    moneySpent: {
      active: false,
      value: {
        max: "39.50",
        min: "2"
      }
    },
    numberOfOrders: {
      active: false,
      value: {
        max: "5",
        min: "1"
      }
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
