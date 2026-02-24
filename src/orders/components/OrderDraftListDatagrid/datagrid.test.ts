import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { type OrderDraft } from "@dashboard/orders/types";

import { createGetCellContent, getCustomerName } from "./datagrid";

const columns: AvailableColumn[] = [
  { id: "number", title: "Number", width: 100 },
  { id: "date", title: "Date", width: 200 },
  { id: "customer", title: "Customer", width: 200 },
  { id: "total", title: "Total", width: 200 },
  { id: "channel", title: "Channel", width: 200 },
];

const createOrder = (overrides: Partial<OrderDraft> = {}): OrderDraft =>
  ({
    id: "order-1",
    number: "1234",
    created: "2024-01-15T14:30:00Z",
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
    },
    userEmail: "john@example.com",
    total: {
      gross: {
        amount: 99.99,
        currency: "USD",
      },
    },
    channel: {
      name: "Default Channel",
    },
    ...overrides,
  }) as unknown as OrderDraft;

describe("createGetCellContent", () => {
  it("returns formatted date cell for date column", () => {
    // Arrange
    const orders = [createOrder()];
    const getCellContent = createGetCellContent({
      orders,
      locale: Locale.EN,
      columns,
    });

    // Act
    const cell = getCellContent([1, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "Jan 15, 2024 2:30 PM");
  });

  it("returns empty text cell when row data is missing", () => {
    // Arrange
    const orders: OrderDraft[] = [];
    const getCellContent = createGetCellContent({
      orders,
      locale: Locale.EN,
      columns,
    });

    // Act
    const cell = getCellContent([1, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "");
  });

  it("returns empty text cell when column ID is missing", () => {
    // Arrange
    const orders = [createOrder()];
    const getCellContent = createGetCellContent({
      orders,
      locale: Locale.EN,
      columns,
    });

    // Act
    const cell = getCellContent([99, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "");
  });

  it("returns order number cell prefixed with #", () => {
    // Arrange
    const orders = [createOrder({ number: "5678" } as Partial<OrderDraft>)];
    const getCellContent = createGetCellContent({
      orders,
      locale: Locale.EN,
      columns,
    });

    // Act
    const cell = getCellContent([0, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "#5678");
  });
});

describe("getCustomerName", () => {
  it("should return billing address first name and last name when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
      },
    } as OrderDraft;
    // Act
    const result = getCustomerName(data);

    // Assert
    expect(result).toEqual("John Doe");
  });
  it("should return user email when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        city: "New York",
      },
      userEmail: "john@doe.com",
    } as OrderDraft;
    // Act
    const result = getCustomerName(data);

    // Assert
    expect(result).toEqual("john@doe.com");
  });
  it("should return - when no user email and billing address", () => {
    // Arrange
    const data = {} as OrderDraft;
    // Act
    const result = getCustomerName(data);

    // Assert
    expect(result).toEqual("-");
  });
});
