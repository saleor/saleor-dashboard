import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderListQuery, OrderStatus, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { TextCell } from "@glideapps/glide-data-grid";
import { renderHook } from "@testing-library/react-hooks";

import { getCustomerCellContent, useGetCellContent } from "./datagrid";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x),
  })),
  defineMessages: jest.fn(x => x),
}));

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
    { id: "status", title: "Status", width: 100 },
    { id: "total", title: "Total", width: 100 },
  ];

  const mockOrders = [
    {
      __typename: "Order",
      id: "order-1",
      number: "1",
      created: "2023-01-01T00:00:00Z",
      userEmail: "john@example.com",
      paymentStatus: "PAID" as PaymentChargeStatusEnum,
      status: "FULFILLED" as OrderStatus,
      billingAddress: null,
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
      copyData: "PAID",
      cursor: "pointer",
      data: {
        color: {
          base: "#ffdeea",
          border: "#eec4cf",
          text: "#6a4751",
        },
        kind: "auto-tags-cell",
        value: "PAID",
      },
      kind: "custom",
      readonly: false,
    });
    expect(getCellContent([4, 0], contentOpts)).toEqual({
      allowOverlay: true,
      copyData: {
        defaultMessage: "Fulfilled",
        description: "order status",
        id: "pkjXPD",
      },
      cursor: "pointer",
      data: {
        color: {
          base: "#d7f5d7",
          border: "#bddabd",
          text: "#415a41",
        },
        kind: "auto-tags-cell",
        value: {
          defaultMessage: "Fulfilled",
          description: "order status",
          id: "pkjXPD",
        },
      },
      kind: "custom",
      readonly: false,
    });
    expect(getCellContent([5, 0], contentOpts)).toEqual({
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
