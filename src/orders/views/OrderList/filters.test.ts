import { InitialOrderStateResponse } from "@dashboard/components/ConditionalFilter/API/initialState/orders/InitialOrderState";
import { TokenArray } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray";
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

describe("[old] Filtering query params", () => {
  it("should be empty object if no params given", () => {
    // Arrange & Act
    const params: OrderListUrlFilters = {};
    const filterVariables = getFilterVariables(params, [], false);

    // Assert
    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });
  it("should not be empty object if params given", () => {
    // Arrange & Act
    const params: OrderListUrlFilters = {
      createdFrom: date.from,
      createdTo: date.to,
      customer: "email@example.com",
      status: [OrderStatusFilter.FULFILLED, OrderStatusFilter.PARTIALLY_FULFILLED],
    };
    const filterVariables = getFilterVariables(params, [], false);

    // Assert
    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});

describe("[old] Filtering URL params", () => {
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

describe("[new] Filtering URL params", () => {
  it("should be empty object if no params given", () => {
    // Arrange & Act
    const params: OrderListUrlFilters = {};
    const filterVariables = getFilterVariables(params, [], true);

    // Assert
    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    // Arrange
    const params = new URLSearchParams(
      "0%5Bs2.status%5D%5B0%5D=FULFILLED&0%5Bs2.status%5D%5B1%5D=CANCELED&1=AND&2%5Bs0.customer%5D=customer&3=AND&4%5Bs0.isClickAndCollect%5D=false",
    );
    const tokenizedUrl = new TokenArray(params.toString());
    const initialOrderState = InitialOrderStateResponse.empty();

    initialOrderState.status = [
      {
        label: "Fulfilled",
        slug: "FULFILLED",
        value: "FULFILLED",
      },
      {
        label: "Canceled",
        slug: "CANCELED",
        value: "CANCELED",
      },
      {
        label: "Unconfirmed",
        slug: "UNCONFIRMED",
        value: "UNCONFIRMED",
      },
    ];
    initialOrderState.customer = [
      {
        label: "Customer",
        slug: "customer",
        value: "test",
      },
    ];
    initialOrderState.isClickAndCollect = [
      {
        label: "No",
        slug: "false",
        value: "false",
      },
    ];

    // Act
    const filterVariables = getFilterVariables(
      {},
      tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      true,
    );

    // Assert
    expect(getExistingKeys(filterVariables)).toHaveLength(3);
    expect(filterVariables.customer).toBe("test");
    expect(filterVariables.status).toEqual(["FULFILLED", "CANCELED"]);
    expect(filterVariables.isClickAndCollect).toBe(false);
  });
});
