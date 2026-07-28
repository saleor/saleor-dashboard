import { type OrderDetailsFragment } from "@dashboard/graphql";
import { OrderRefundAmountCalculationMode } from "@dashboard/orders/components/OrderRefundPage/form";
import { type OrderReturnFormData } from "@dashboard/orders/components/OrderReturnPage/form";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import OrderReturn from "./OrderReturn";
import ReturnFormDataParser from "./utils";

// The page renders the whole return form; only *which* view is chosen and what
// each one asks the return mutation to refund is under test here.
jest.mock("@dashboard/orders/components/OrderReturnPage", () => ({
  __esModule: true,
  default: () => null,
}));

const submitOpts = jest.fn();
const refundWithinReturn = jest.fn();

jest.mock("./useOrderReturnSubmit", () => ({
  useOrderReturnSubmit: (opts: unknown) => {
    submitOpts(opts);

    return {
      handleSubmit: jest.fn(),
      returnErrors: undefined,
      returnedOrder: undefined,
      submitStatus: "default",
      submitting: false,
    };
  },
}));
jest.mock("./useRefundWithinReturn", () => ({
  useRefundWithinReturn: (opts: unknown) => {
    refundWithinReturn(opts);

    return {
      sendMutations: jest.fn(),
      grantRefundErrors: [],
      sendRefundErrors: [],
      grantRefundResponseOrderData: undefined,
    };
  },
}));

const mockOrder = jest.fn<OrderDetailsFragment | undefined, []>();

jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<typeof import("@dashboard/graphql")>("@dashboard/graphql"),
  useOrderDetailsQuery: () => ({ data: { order: mockOrder() }, loading: false }),
  useRefundSettingsQuery: () => ({ data: undefined }),
}));

const formData: OrderReturnFormData = {
  transactionId: "",
  amount: 12,
  refundShipmentCosts: true,
  autoGrantRefund: false,
  autoSendRefund: false,
  amountCalculationMode: OrderRefundAmountCalculationMode.MANUAL,
  reason: "",
  reasonReference: "",
  refundReason: "",
  refundReasonReference: "",
  itemsToBeReplaced: [],
  fulfilledItemsQuantities: [],
  waitingItemsQuantities: [],
  unfulfilledItemsQuantities: [],
  lineReasons: [],
};

const renderRoute = (order: OrderDetailsFragment) => {
  mockOrder.mockReturnValue(order);

  return render(
    <Wrapper>
      <MemoryRouter>
        <OrderReturn orderId={order.id} params={{}} />
      </MemoryRouter>
    </Wrapper>,
  );
};

const buildInputFor = (order: OrderDetailsFragment) =>
  submitOpts.mock.calls[0][0].buildInput(new ReturnFormDataParser({ order, formData }));

describe("order return route ownership", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("never grants a refund within a legacy return", () => {
    // Arrange
    const order = OrderFixture.fulfilled().withLegacyPayments().build();

    // Act
    renderRoute(order);

    // Assert
    expect(refundWithinReturn).not.toHaveBeenCalled();
  });

  it("owns the grant/send refund mutations in the transactions return", () => {
    // Arrange
    const order = OrderFixture.fulfilled().withTransaction().build();

    // Act
    renderRoute(order);

    // Assert
    expect(refundWithinReturn).toHaveBeenCalledWith(
      expect.objectContaining({ transactionId: order.transactions[0].id }),
    );
  });

  it("lets the legacy return mutation perform the refund", () => {
    // Arrange
    const order = OrderFixture.fulfilled().withLegacyPayments().build();

    // Act
    renderRoute(order);

    // Assert
    expect(buildInputFor(order)).toEqual(
      expect.objectContaining({ amountToRefund: 12, refund: true }),
    );
  });

  it("keeps the transactions return mutation refund-free", () => {
    // Arrange
    const order = OrderFixture.fulfilled().withTransaction().build();

    // Act
    renderRoute(order);

    // Assert
    expect(buildInputFor(order)).toEqual(
      expect.objectContaining({ amountToRefund: 0, refund: false }),
    );
  });

  it("sends the same neutral return payload in both modes", () => {
    // Arrange
    const legacy = OrderFixture.fulfilled().withLegacyPayments().build();
    const transactions = OrderFixture.fulfilled().withTransaction().build();

    // Act
    renderRoute(legacy);

    const { amountToRefund: _a, refund: _r, ...legacyCommon } = buildInputFor(legacy);

    jest.clearAllMocks();
    renderRoute(transactions);

    const { amountToRefund: _a2, refund: _r2, ...transactionCommon } = buildInputFor(transactions);

    // Assert
    expect(legacyCommon).toEqual(transactionCommon);
    expect(legacyCommon).toEqual(expect.objectContaining({ includeShippingCosts: true }));
  });
});
