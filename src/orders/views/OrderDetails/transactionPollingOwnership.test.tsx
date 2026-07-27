import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { render } from "@testing-library/react";

import { LegacyOrderDetails } from "./LegacyOrderDetails/LegacyOrderDetails";
import { type NonDraftOrderDetailsProps } from "./nonDraftOrderDetailsProps";
import { TransactionOrderDetails } from "./TransactionOrderDetails/TransactionOrderDetails";
import { useOrderTransactionPolling } from "./useOrderTransactionPolling";

// Delegated lifecycle views are irrelevant to polling ownership; stub them out.
jest.mock("./OrderNormalDetails", () => ({ OrderNormalDetails: () => null }));
jest.mock("./OrderUnconfirmedDetails", () => ({ OrderUnconfirmedDetails: () => null }));
jest.mock("./useOrderTransactionPolling", () => ({ useOrderTransactionPolling: jest.fn() }));

// The concrete views forward a wide prop bundle to the (mocked) lifecycle views;
// only `data.order` and the polling controls are exercised here, so a minimal
// fixture cast keeps the test focused on ownership.
const order = OrderFixture.fulfilled().withTransaction().build();
const baseProps = { data: { order }, loading: false } as unknown as NonDraftOrderDetailsProps;
const pollingControls = {
  startPolling: jest.fn(),
  stopPolling: jest.fn(),
  refetch: jest.fn(() => Promise.resolve()),
};

describe("transaction polling ownership", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mounts transaction polling for the Transactions view", () => {
    // Act
    render(<TransactionOrderDetails {...baseProps} {...pollingControls} />);

    // Assert
    expect(useOrderTransactionPolling).toHaveBeenCalledTimes(1);
    expect(useOrderTransactionPolling).toHaveBeenCalledWith(
      expect.objectContaining({ order, ...pollingControls }),
    );
  });

  it("never mounts transaction polling for the Legacy view", () => {
    // Act
    render(<LegacyOrderDetails {...baseProps} />);

    // Assert
    expect(useOrderTransactionPolling).not.toHaveBeenCalled();
  });
});
