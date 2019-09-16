import { createIntl } from "react-intl";

import { OrderFilterKeys } from "@saleor/orders/components/OrderListFilter";
import { OrderStatus, OrderStatusFilter } from "@saleor/types/globalTypes";
import { createFilter, createFilterChips, getFilterVariables } from "./filters";

const mockIntl = createIntl({
  locale: "en"
});

describe("Create filter object", () => {
  it("with date", () => {
    const filter = createFilter(
      {},
      {
        name: OrderFilterKeys.dateEqual,
        value: "2019-09-01"
      }
    );

    expect(filter).toMatchSnapshot();
  });

  it("with date range", () => {
    const filter = createFilter(
      {},
      {
        name: OrderFilterKeys.dateRange,
        value: ["2019-09-01", "2019-09-10"]
      }
    );

    expect(filter).toMatchSnapshot();
  });

  it("with date last week", () => {
    const filter = createFilter(
      {},
      {
        name: OrderFilterKeys.dateLastWeek,
        value: "2019-09-01"
      }
    );

    expect(filter).toMatchSnapshot();
  });

  it("with date last month", () => {
    const filter = createFilter(
      {},
      {
        name: OrderFilterKeys.dateLastMonth,
        value: "2019-09-01"
      }
    );

    expect(filter).toMatchSnapshot();
  });

  it("with date last year", () => {
    const filter = createFilter(
      {},
      {
        name: OrderFilterKeys.dateLastYear,
        value: "2019-09-01"
      }
    );

    expect(filter).toMatchSnapshot();
  });

  it("with fulfillment status", () => {
    const filter = createFilter(
      {},
      {
        name: OrderFilterKeys.status,
        value: OrderStatusFilter.PARTIALLY_FULFILLED
      }
    );

    expect(filter).toMatchSnapshot();
  });

  it("with multiple values", () => {
    const filter = createFilter(
      {
        status: [OrderStatusFilter.FULFILLED]
      },
      {
        name: OrderFilterKeys.status,
        value: OrderStatusFilter.PARTIALLY_FULFILLED
      }
    );

    expect(filter).toMatchSnapshot();
  });

  it("with multiple deduped values", () => {
    const filter = createFilter(
      {
        status: [OrderStatusFilter.FULFILLED]
      },
      {
        name: OrderFilterKeys.status,
        value: OrderStatusFilter.FULFILLED
      }
    );

    expect(filter).toMatchSnapshot();
  });
});

test("Crate filter chips", () => {
  const chips = createFilterChips(
    {
      dateFrom: "2019-09-01",
      dateTo: "2019-09-10",
      email: "email@example.com",
      status: [OrderStatus.FULFILLED, OrderStatus.PARTIALLY_FULFILLED]
    },
    {
      formatDate: date => date
    },
    jest.fn(),
    mockIntl as any
  );

  expect(chips).toMatchSnapshot();
});

describe("Get filter variables", () => {
  it("from single status value", () => {
    const filter = getFilterVariables({
      dateFrom: "2019-09-01",
      dateTo: "2019-09-10",
      email: "email@example.com",
      query: "24",
      status: OrderStatus.FULFILLED.toString()
    });

    expect(filter).toMatchSnapshot();
  });

  it("from multiple status value", () => {
    const filter = getFilterVariables({
      dateFrom: "2019-09-01",
      dateTo: "2019-09-10",
      email: "email@example.com",
      query: "24",
      status: [
        OrderStatus.FULFILLED.toString(),
        OrderStatus.PARTIALLY_FULFILLED.toString()
      ]
    });

    expect(filter).toMatchSnapshot();
  });
});
