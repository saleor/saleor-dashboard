import { date } from "@dashboard/fixtures";
import { OrderStatusFilter, PaymentChargeStatusEnum } from "@dashboard/graphql";
import {
  createFilterStructure,
  OrderFilterGiftCard,
} from "@dashboard/orders/components/OrderListPage";
import { OrderListUrlFilters } from "@dashboard/orders/urls";
import { getFilterQueryParams } from "@dashboard/utils/filters";
import { stringifyQs } from "@dashboard/utils/urls";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { createIntl } from "react-intl";

import { getFilterQueryParam, getFilterVariables } from "./filters";

describe("Filtering query params", () => {
  // TODO: Fix the tests
  it.skip("should be empty object if no params given", () => {
    const params: OrderListUrlFilters = {};
    // @ts-expect-error - TODO
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });
  it.skip("should not be empty object if params given", () => {
    const params: OrderListUrlFilters = {
      createdFrom: date.from,
      createdTo: date.to,
      customer: "email@example.com",
      status: [OrderStatusFilter.FULFILLED, OrderStatusFilter.PARTIALLY_FULFILLED],
    };
    // @ts-expect-error - TODO
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});
describe("Filtering URL params", () => {
  const intl = createIntl(config);
  const filters = createFilterStructure(intl, {
    preorder: {
      active: false,
      value: false,
    },
    clickAndCollect: {
      active: false,
      value: false,
    },
    channel: {
      active: false,
      value: [],
      choices: [
        {
          label: "Channel PLN",
          value: "channelId",
        },
      ],
    },
    created: {
      active: false,
      value: {
        max: date.to,
        min: date.from,
      },
    },
    customer: {
      active: false,
      value: "email@example.com",
    },
    status: {
      active: false,
      value: [OrderStatusFilter.FULFILLED, OrderStatusFilter.PARTIALLY_FULFILLED],
    },
    paymentStatus: {
      active: false,
      value: [PaymentChargeStatusEnum.FULLY_CHARGED, PaymentChargeStatusEnum.PARTIALLY_CHARGED],
    },
    giftCard: {
      active: false,
      value: [OrderFilterGiftCard.paid, OrderFilterGiftCard.bought],
    },
    metadata: {
      active: false,
      value: [
        {
          key: "",
          value: "",
        },
      ],
    },
  });

  it("should be empty if no active filters", () => {
    const filterQueryParams = getFilterQueryParams(filters, getFilterQueryParam);

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
