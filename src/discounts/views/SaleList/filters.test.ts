import { createFilterStructure } from "@saleor/discounts/components/SaleListPage";
import { SaleListUrlFilters } from "@saleor/discounts/urls";
import { date } from "@saleor/fixtures";
import { DiscountStatusEnum, DiscountValueTypeEnum } from "@saleor/graphql";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { stringifyQs } from "@saleor/utils/urls";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { createIntl } from "react-intl";

import { getFilterQueryParam, getFilterVariables } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: SaleListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: SaleListUrlFilters = {
      startedFrom: date.from,
      startedTo: date.to,
      status: [DiscountStatusEnum.ACTIVE, DiscountStatusEnum.EXPIRED],
      type: DiscountValueTypeEnum.FIXED,
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(intl, {
    channel: {
      active: false,
      choices: [
        {
          value: "default-channel",
          label: "Default channel",
        },
      ],
      value: "default-channel",
    },
    saleType: {
      active: false,
      value: DiscountValueTypeEnum.FIXED,
    },
    started: {
      active: false,
      value: {
        max: date.to,
        min: date.from,
      },
    },
    status: {
      active: false,
      value: [DiscountStatusEnum.ACTIVE, DiscountStatusEnum.EXPIRED],
    },
  });

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
