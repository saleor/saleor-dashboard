import { type PillCell } from "@dashboard/components/Datagrid/customCells/PillCell";
import { type GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import {
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  type OrderListQuery,
  type OrderStatus,
} from "@dashboard/graphql";
import { getStatusColor } from "@dashboard/misc";
import { type RelayToFlat } from "@dashboard/types";
import { type TextCell } from "@glideapps/glide-data-grid";
import { testIntlInstance } from "@test/intl";
import { renderHook } from "@testing-library/react";

import {
  getCustomerCellContent,
  getDeliveryCellContent,
  getPaymentCellContent,
  useGetCellContent,
} from "./datagrid";

jest.mock("@saleor/macaw-ui-next", () => ({
  useTheme: () => ({ theme: "defaultLight" }),
}));

describe("getCustomerCellContent", () => {
  it("should return billing address first name and last name when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
      },
    } as RelayToFlat<NonNullable<OrderListQuery["orders"]>>[number];
    // Act
    const result = getCustomerCellContent(data);

    // Assert
    expect(result.data).toEqual("John Doe");
    expect(result.displayData).toEqual("John Doe");
  });
  it("should return user email when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        city: "New York",
      },
      userEmail: "john@doe.com",
    } as RelayToFlat<NonNullable<OrderListQuery["orders"]>>[number];
    // Act
    const result = getCustomerCellContent(data);

    // Assert
    expect(result.data).toEqual("john@doe.com");
    expect(result.displayData).toEqual("john@doe.com");
  });
  it("should return - when no user email and billing address", () => {
    // Arrange
    const data = {} as RelayToFlat<NonNullable<OrderListQuery["orders"]>>[number];
    // Act
    const result = getCustomerCellContent(data);

    // Assert
    expect(result.data).toEqual("-");
    expect(result.displayData).toEqual("-");
  });
  it("should return - when no data", () => {
    // Arrange & Act
    const result = getCustomerCellContent(undefined);

    // Assert
    expect(result.data).toEqual("-");
    expect(result.displayData).toEqual("-");
  });
});

describe("useGetCellContent", () => {
  // Arrange
  const mockColumns: AvailableColumn[] = [
    { id: "number", title: "Number", width: 100 },
    { id: "date", title: "Date", width: 100 },
    { id: "customer", title: "Customer", width: 100 },
    { id: "payment", title: "Payment", width: 100 },
    { id: "delivery", title: "Delivery", width: 100 },
    { id: "status", title: "Status", width: 100 },
    { id: "net", title: "Net", width: 100 },
    { id: "total", title: "Total", width: 100 },
  ];

  const mockOrders = [
    {
      __typename: "Order",
      id: "order-1",
      number: "1",
      created: "2023-01-01T00:00:00Z",
      userEmail: "john@example.com",
      chargeStatus: OrderChargeStatusEnum.FULL,
      authorizeStatus: OrderAuthorizeStatusEnum.FULL,
      totalCharged: { __typename: "Money", amount: 100 },
      totalChargePending: { __typename: "Money", amount: 0 },
      totalRefunded: { __typename: "Money", amount: 0 },
      status: "FULFILLED" as OrderStatus,
      deliveryMethod: { __typename: "ShippingMethod" },
      billingAddress: null,
      subtotal: { net: { amount: 80, currency: "USD" } },
      total: { gross: { amount: 100, currency: "USD" } },
    },
  ] as RelayToFlat<NonNullable<OrderListQuery["orders"]>>;

  it("should return correct cell content for each column", () => {
    // Arrange
    const { result } = renderHook(() =>
      useGetCellContent({ columns: mockColumns, orders: mockOrders }),
    );
    const getCellContent = result.current;
    const contentOpts = { added: [], removed: [] } as unknown as GetCellContentOpts;

    // Act & Assert
    expect(getCellContent([0, 0], contentOpts)).toEqual({
      allowOverlay: false,
      cursor: "pointer",
      data: "1",
      displayData: "1",
      kind: "text",
      readonly: true,
      style: "normal",
    });
    expect(getCellContent([1, 0], contentOpts)).toEqual({
      allowOverlay: true,
      copyData: "2023-01-01T00:00:00Z",
      cursor: "pointer",
      data: {
        kind: "date-cell",
        value: "2023-01-01T00:00:00Z",
      },
      kind: "custom",
      readonly: false,
    });
    expect(getCellContent([2, 0], contentOpts)).toEqual({
      allowOverlay: false,
      cursor: "pointer",
      data: "john@example.com",
      displayData: "john@example.com",
      kind: "text",
      readonly: true,
      style: "normal",
    });
    expect(getCellContent([3, 0], contentOpts)).toEqual({
      allowOverlay: true,
      copyData: "Fully paid",
      cursor: "pointer",
      data: {
        color: getStatusColor({ status: "success", currentTheme: "defaultLight" }),
        kind: "auto-tags-cell",
        value: "Fully paid",
      },
      kind: "custom",
      readonly: false,
    });
    expect(getCellContent([4, 0], contentOpts)).toEqual({
      allowOverlay: true,
      copyData: "Shipping",
      cursor: "pointer",
      data: {
        color: getStatusColor({ status: "neutral", currentTheme: "defaultLight" }),
        kind: "auto-tags-cell",
        value: "Shipping",
      },
      kind: "custom",
      readonly: false,
    });
    expect(getCellContent([5, 0], contentOpts)).toEqual({
      allowOverlay: true,
      copyData: "Fulfilled",
      cursor: "pointer",
      data: {
        color: getStatusColor({ status: "success", currentTheme: "defaultLight" }),
        kind: "auto-tags-cell",
        value: "Fulfilled",
      },
      kind: "custom",
      readonly: false,
    });
    expect(getCellContent([6, 0], contentOpts)).toEqual({
      allowOverlay: true,
      copyData: "80",
      cursor: "pointer",
      data: { currency: "USD", kind: "money-cell", value: 80 },
      kind: "custom",
      readonly: false,
    });
    expect(getCellContent([7, 0], contentOpts)).toEqual({
      allowOverlay: true,
      copyData: "100",
      cursor: "pointer",
      data: { currency: "USD", kind: "money-cell", value: 100 },
      kind: "custom",
      readonly: false,
    });
  });

  it("should return empty cell for invalid column", () => {
    // Arrange
    const { result } = renderHook(() =>
      useGetCellContent({ columns: mockColumns, orders: mockOrders }),
    );
    const getCellContent = result.current;
    const contentOpts = { added: [], removed: [] } as unknown as GetCellContentOpts;

    // Act & Assert
    expect((getCellContent([10, 0], contentOpts) as TextCell).data).toBe("");
  });

  it("should return empty cell for removed row", () => {
    const { result } = renderHook(() =>
      useGetCellContent({ columns: mockColumns, orders: mockOrders }),
    );
    const getCellContent = result.current;
    const contentOpts = { added: [1], removed: [] } as unknown as GetCellContentOpts;

    // Act & Assert
    expect((getCellContent([0, 1], contentOpts) as TextCell).data).toBe("");
  });
});

type RowDataType = RelayToFlat<NonNullable<OrderListQuery["orders"]>>[number];

describe("getPaymentCellContent", () => {
  const money = (amount: number) => ({ __typename: "Money" as const, amount });

  it.each<{
    expected: string;
    chargeStatus: OrderChargeStatusEnum;
    authorizeStatus?: OrderAuthorizeStatusEnum;
    charged: number;
    pending: number;
    refunded: number;
  }>([
    {
      expected: "Unpaid",
      chargeStatus: OrderChargeStatusEnum.NONE,
      charged: 0,
      pending: 0,
      refunded: 0,
    },
    {
      expected: "Partially paid",
      chargeStatus: OrderChargeStatusEnum.PARTIAL,
      charged: 40,
      pending: 0,
      refunded: 0,
    },
    {
      expected: "Fully paid",
      chargeStatus: OrderChargeStatusEnum.FULL,
      charged: 100,
      pending: 0,
      refunded: 0,
    },
    {
      expected: "Overcharged",
      chargeStatus: OrderChargeStatusEnum.OVERCHARGED,
      charged: 120,
      pending: 0,
      refunded: 0,
    },
    {
      expected: "Pending",
      chargeStatus: OrderChargeStatusEnum.NONE,
      charged: 0,
      pending: 100,
      refunded: 0,
    },
    {
      expected: "Partially refunded",
      chargeStatus: OrderChargeStatusEnum.PARTIAL,
      charged: 60,
      pending: 0,
      refunded: 40,
    },
    {
      expected: "Authorised",
      chargeStatus: OrderChargeStatusEnum.NONE,
      authorizeStatus: OrderAuthorizeStatusEnum.FULL,
      charged: 0,
      pending: 0,
      refunded: 0,
    },
    {
      expected: "Partially authorised",
      chargeStatus: OrderChargeStatusEnum.NONE,
      authorizeStatus: OrderAuthorizeStatusEnum.PARTIAL,
      charged: 0,
      pending: 0,
      refunded: 0,
    },
    {
      expected: "Fully refunded",
      chargeStatus: OrderChargeStatusEnum.NONE,
      charged: 0,
      pending: 0,
      refunded: 100,
    },
  ])(
    "should return $expected",
    ({
      expected,
      chargeStatus,
      authorizeStatus = OrderAuthorizeStatusEnum.NONE,
      charged,
      pending,
      refunded,
    }) => {
      // Arrange
      const data = {
        chargeStatus,
        authorizeStatus,
        totalCharged: money(charged),
        totalChargePending: money(pending),
        totalRefunded: money(refunded),
      } as RowDataType;

      // Act
      const result = getPaymentCellContent(testIntlInstance, "defaultLight", data);

      // Assert
      expect((result.data as PillCell["data"]).value).toEqual(expected);
    },
  );
});

describe("getDeliveryCellContent", () => {
  it("should return Shipping pill when delivery method is a ShippingMethod", () => {
    // Arrange
    const data = {
      deliveryMethod: { __typename: "ShippingMethod" },
    } as RowDataType;

    // Act
    const result = getDeliveryCellContent(testIntlInstance, "defaultLight", data);

    // Assert
    expect((result.data as PillCell["data"]).value).toEqual("Shipping");
  });

  it("should return Pickup pill when delivery method is a Warehouse", () => {
    // Arrange
    const data = {
      deliveryMethod: { __typename: "Warehouse" },
    } as RowDataType;

    // Act
    const result = getDeliveryCellContent(testIntlInstance, "defaultLight", data);

    // Assert
    expect((result.data as PillCell["data"]).value).toEqual("Pickup");

    const infoPill = getStatusColor({ status: "info", currentTheme: "defaultLight" });
    const halfOpacityBackground = infoPill.base.startsWith("oklch(")
      ? infoPill.base.replace(/\)\s*$/, " / 0.5)")
      : `${infoPill.base}80`;

    expect((result.data as PillCell["data"]).color).toEqual({
      ...infoPill,
      base: halfOpacityBackground,
    });
  });

  it("should return dash when delivery method is null", () => {
    // Arrange
    const data = {
      deliveryMethod: null,
    } as RowDataType;

    // Act
    const result = getDeliveryCellContent(testIntlInstance, "defaultLight", data);

    // Assert
    expect((result as TextCell).data).toEqual("-");
  });
});
