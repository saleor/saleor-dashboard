import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { LegacyOrderReturn } from "./LegacyOrderReturn";
import { TransactionOrderReturn } from "./TransactionOrderReturn";

// Only the sidebar each view puts on the shared return page is under test;
// the mutations behind it have their own tests.
jest.mock("./useOrderReturnSubmit", () => ({
  useOrderReturnSubmit: () => ({
    handleSubmit: jest.fn(),
    returnErrors: undefined,
    returnedOrder: undefined,
    submitStatus: "default",
    submitting: false,
  }),
}));
jest.mock("./useRefundWithinReturn", () => ({
  useRefundWithinReturn: () => ({
    sendMutations: jest.fn(),
    grantRefundErrors: [],
    sendRefundErrors: [],
    grantRefundResponseOrderData: undefined,
  }),
}));
jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<typeof import("@dashboard/graphql")>("@dashboard/graphql"),
  useRefundSettingsQuery: () => ({ data: undefined }),
  useReturnSettingsQuery: () => ({ data: undefined }),
}));

// jsdom has no ResizeObserver; the submit cards render macaw fields that use it.
global.ResizeObserver = class {
  observe() {}

  unobserve() {}

  disconnect() {}
} as never;

const order = OrderFixture.fulfilled().withTransaction().build();

const renderView = (view: JSX.Element) =>
  render(
    <Wrapper>
      <MemoryRouter>{view}</MemoryRouter>
    </Wrapper>,
  );

describe("order return submit card ownership", () => {
  it("shows the legacy payment submit card in the legacy return", () => {
    // Act
    renderView(<LegacyOrderReturn orderId={order.id} order={order} loading={false} />);

    // Assert: the legacy refund amount input, and no transaction refund controls —
    // even though this order has transactions; the view's mode decides.
    expect(screen.getByTestId("amountInput")).toBeInTheDocument();
    expect(screen.queryByTestId("auto-grant-refund-checkbox")).not.toBeInTheDocument();
  });

  it("shows the transaction submit card in the transactions return", () => {
    // Act
    renderView(<TransactionOrderReturn orderId={order.id} order={order} loading={false} />);

    // Assert
    expect(screen.getByTestId("auto-grant-refund-checkbox")).toBeInTheDocument();
    expect(screen.queryByTestId("amountInput")).not.toBeInTheDocument();
  });
});
