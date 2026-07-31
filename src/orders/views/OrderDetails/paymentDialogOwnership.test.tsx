import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { render } from "@testing-library/react";
import { type ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

// `mock` prefix so jest's hoisted mock factory may reference it.
import { useOrderRefundNavigation as mockUseOrderRefundNavigation } from "../../orderRefundNavigation";
import { LegacyOrderDetails } from "./LegacyOrderDetails/LegacyOrderDetails";
import { type NonDraftOrderDetailsProps } from "./nonDraftOrderDetailsProps";
import { TransactionOrderDetails } from "./TransactionOrderDetails/TransactionOrderDetails";

// Lifecycle rendering, polling and the mutation hooks are irrelevant here; the
// question is only *which* payment dialogs each concrete view mounts.
// Stands in for any shared module below the seam: it reads the refund
// destination from context without knowing the payment mode.
const observedRefundUrl = jest.fn();

jest.mock("./OrderNormalDetails", () => ({
  OrderNormalDetails: () => {
    observedRefundUrl(mockUseOrderRefundNavigation()?.url);

    return null;
  },
}));
jest.mock("./OrderUnconfirmedDetails", () => ({ OrderUnconfirmedDetails: () => null }));
jest.mock("./useOrderTransactionPolling", () => ({ useOrderTransactionPolling: jest.fn() }));
jest.mock("./operations/useCommonOrderOperations", () => ({
  useCommonOrderOperations: () => ({}),
}));
jest.mock("./operations/useLegacyOrderOperations", () => ({
  useLegacyOrderOperations: () => ({}),
}));
jest.mock("./operations/useTransactionOrderOperations", () => ({
  useTransactionOrderOperations: () => ({}),
}));

const legacyDialogs = jest.fn();
const transactionDialogs = jest.fn();

jest.mock("./LegacyOrderDetails/LegacyPaymentDialogs", () => ({
  LegacyPaymentDialogs: (props: unknown) => {
    legacyDialogs(props);

    return null;
  },
}));
jest.mock("./TransactionOrderDetails/TransactionPaymentDialogs", () => ({
  TransactionPaymentDialogs: (props: unknown) => {
    transactionDialogs(props);

    return null;
  },
}));

const order = OrderFixture.fulfilled().withTransaction().build();
// The concrete views forward a wide prop bundle to the (mocked) lifecycle views;
// only the route context is exercised here, so a minimal fixture cast keeps the
// test focused on ownership.
const baseProps = {
  id: order.id,
  params: {},
  data: { order },
  loading: false,
} as unknown as NonDraftOrderDetailsProps;
const pollingControls = {
  startPolling: jest.fn(),
  stopPolling: jest.fn(),
  refetch: jest.fn(() => Promise.resolve()),
};

const renderInRouter = (view: ReactElement) => render(<MemoryRouter>{view}</MemoryRouter>);

describe("payment dialog ownership", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mounts only the legacy dialogs for the Legacy view", () => {
    // Act
    renderInRouter(<LegacyOrderDetails {...baseProps} />);

    // Assert
    expect(legacyDialogs).toHaveBeenCalledTimes(1);
    expect(transactionDialogs).not.toHaveBeenCalled();
  });

  it("mounts only the transaction dialogs for the Transactions view", () => {
    // Act
    renderInRouter(<TransactionOrderDetails {...baseProps} {...pollingControls} />);

    // Assert
    expect(transactionDialogs).toHaveBeenCalledTimes(1);
    expect(legacyDialogs).not.toHaveBeenCalled();
  });

  it("publishes the legacy refund destination to shared modules below the seam", () => {
    // Act
    renderInRouter(<LegacyOrderDetails {...baseProps} />);

    // Assert: the payment-refund page, even though this order has transactions —
    // the view's own mode decides, not the order's history.
    expect(observedRefundUrl).toHaveBeenCalledWith(
      expect.stringContaining(`/orders/${encodeURIComponent(order.id)}/payment-refund`),
    );
  });

  it("publishes the transaction refund destination to shared modules below the seam", () => {
    // Act
    renderInRouter(<TransactionOrderDetails {...baseProps} {...pollingControls} />);

    // Assert
    expect(observedRefundUrl).toHaveBeenCalledWith(
      expect.stringContaining(`/orders/${encodeURIComponent(order.id)}/refund`),
    );
    expect(transactionDialogs.mock.calls[0][0].refundNavigation.getNavigation().url).toContain(
      `/orders/${encodeURIComponent(order.id)}/refund`,
    );
  });
});
