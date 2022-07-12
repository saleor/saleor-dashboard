import { createFilterStructure } from "@saleor/customers/components/CustomerListPage";
import { CustomerListUrlFilters } from "@saleor/customers/urls";
import { date } from "@saleor/fixtures";
import { PermissionEnum } from "@saleor/graphql";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { stringifyQs } from "@saleor/utils/urls";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { createIntl } from "react-intl";

import { getFilterQueryParam, getFilterVariables } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: CustomerListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: CustomerListUrlFilters = {
      joinedFrom: date.from,
      numberOfOrdersTo: "5",
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(2);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(
    intl,
    {
      joined: {
        active: false,
        value: {
          max: date.to,
          min: date.from,
        },
      },
      numberOfOrders: {
        active: false,
        value: {
          max: "5",
          min: "1",
        },
      },
    },
    [
      {
        code: PermissionEnum.MANAGE_USERS,
        name: "Manage customers.",
        __typename: "UserPermission",
      },
      {
        code: PermissionEnum.MANAGE_ORDERS,
        name: "Manage orders..",
        __typename: "UserPermission",
      },
    ],
  );

  it("should be empty if no active filters", () => {
    const filterQueryParams = getFilterQueryParams(
      filters,
      getFilterQueryParam,
    );

    expect(getExistingKeys(filterQueryParams)).toHaveLength(0);
  });

  it("should not be empty if active filters are present", () => {
    const filterQueryParams = getFilterQueryParams(
      setFilterOptsStatus(filters, true),
      getFilterQueryParam,
    );

    expect(filterQueryParams).toMatchSnapshot();
    expect(stringifyQs(filterQueryParams)).toMatchSnapshot();
  });
});
