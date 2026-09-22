import { type CustomerDetailsQuery, OrderStatus } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { CustomerOrders } from "./CustomerOrders";

const orders: NonNullable<
  NonNullable<NonNullable<CustomerDetailsQuery["user"]>["orders"]>["edges"]
>[number]["node"][] = [
  {
    __typename: "Order",
    id: "T3JkZXI6MTk=",
    created: "2018-05-07T09:37:30.124154+00:00",
    number: "8234",
    status: OrderStatus.FULFILLED,
    total: {
      __typename: "TaxedMoney",
      gross: {
        __typename: "Money",
        amount: 1215.89,
        currency: "USD",
      },
    },
    channel: {
      __typename: "Channel",
      id: "Q2hhbm5lbDox",
      name: "United States",
      slug: "us",
      isActive: true,
      currencyCode: "USD",
    },
  },
];

const renderOrders = (
  props?: Partial<ComponentProps<typeof CustomerOrders>>,
): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <MemoryRouter>
        <CustomerOrders orders={orders} viewAllHref="/orders" {...props} />
      </MemoryRouter>
    </Wrapper>,
  );

describe("CustomerOrders", () => {
  it("renders order number, fulfillment status, total, and channel for support jump-list jobs", () => {
    // Arrange / Act
    renderOrders();

    // Assert
    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Order status")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Channel")).toBeInTheDocument();
    expect(screen.getByText("#8234")).toBeInTheDocument();
    expect(screen.getByTestId("customer-order-status")).toHaveTextContent(/fulfilled/i);
    expect(screen.getByTestId("channel-display")).toHaveTextContent("United States");
    expect(screen.getByRole("link", { name: "#8234" })).toHaveAttribute(
      "href",
      "/orders/T3JkZXI6MTk%3D",
    );
  });

  it("renders an empty state when the customer has no orders", () => {
    // Arrange / Act
    renderOrders({ orders: [] });

    // Assert
    expect(screen.getByText("No orders found")).toBeInTheDocument();
  });

  it("keeps View all disabled and unlinked while orders are loading", () => {
    // Arrange / Act
    renderOrders({ orders: undefined });

    // Assert
    const viewAll = screen.getByRole("button", { name: /view all orders/i });

    expect(viewAll).toBeDisabled();
    expect(viewAll.closest("a")).toBeNull();
    expect(screen.queryByText("No orders found")).not.toBeInTheDocument();
  });
});
