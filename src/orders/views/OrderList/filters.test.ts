import { date } from "@saleor/fixtures";
import { createFilterStructure } from "@saleor/orders/components/OrderListPage";
import { OrderListUrlFilters } from "@saleor/orders/urls";
import { OrderStatusFilter } from "@saleor/types/globalTypes";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { stringify as stringifyQs } from "qs";
import { createIntl } from "react-intl";

import { getFilterQueryParam, getFilterVariables } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: OrderListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: OrderListUrlFilters = {
      createdFrom: date.from,
      createdTo: date.to,
      customer: "email@example.com",
      status: [
        OrderStatusFilter.FULFILLED,
        OrderStatusFilter.PARTIALLY_FULFILLED
      ]
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(intl, {
    created: {
      active: false,
      value: {
        max: date.to,
        min: date.from
      }
    },
    customer: {
      active: false,
      value: "email@example.com"
    },
    status: {
      active: false,
      value: [
        OrderStatusFilter.FULFILLED,
        OrderStatusFilter.PARTIALLY_FULFILLED
      ]
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
