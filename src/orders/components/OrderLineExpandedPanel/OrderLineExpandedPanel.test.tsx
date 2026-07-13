// @ts-strict-ignore
import {
  type OrderDetailsFragment,
  OrderGrantedRefundStatusEnum,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { buildOrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { OrderLineExpandedPanel } from "./OrderLineExpandedPanel";

const line = OrderFixture.fulfilled().build().lines[0];

const createOrderWithDraftRefund = (): OrderDetailsFragment => {
  const order = OrderFixture.fulfilled().build();

  return {
    ...order,
    grantedRefunds: [
      {
        __typename: "OrderGrantedRefund" as const,
        id: "granted-refund-draft",
        status: OrderGrantedRefundStatusEnum.NONE,
        amount: { __typename: "Money" as const, amount: 25, currency: "USD" },
        reason: "Customer changed mind",
        createdAt: "2023-10-06T12:00:00Z",
        reasonReference: null,
        user: null,
        app: null,
        shippingCostsIncluded: false,
        transactionEvents: [],
        lines: [
          {
            __typename: "OrderGrantedRefundLine" as const,
            id: "granted-line-1",
            quantity: 1,
            reason: null,
            reasonReference: null,
            orderLine: {
              __typename: "OrderLine" as const,
              id: line.id,
              productName: line.productName,
              variantName: line.variant?.name ?? "",
              thumbnail: null,
            },
          },
        ],
      },
    ],
  };
};

const defaultProps = {
  fulfillmentAllowUnpaid: false,
  onOrderFulfillmentApprove: jest.fn(),
  onOrderFulfillmentCancel: jest.fn(),
  onTrackingCodeAdd: jest.fn(),
  onFulfillmentShowMetadata: jest.fn(),
  showCanceledShipments: false,
  onShowCanceledShipmentsChange: jest.fn(),
};

const renderPanel = (lifecycle = buildOrderLineLifecycle(createOrderWithDraftRefund())[0]) =>
  render(
    <MemoryRouter>
      <Wrapper>
        <OrderLineExpandedPanel
          {...defaultProps}
          lifecycle={lifecycle}
          order={createOrderWithDraftRefund()}
        />
      </Wrapper>
    </MemoryRouter>,
  );

describe("OrderLineExpandedPanel", () => {
  it("renders transaction refund cards with draft status", () => {
    // Arrange // Act
    renderPanel();

    // Assert
    expect(screen.getByText("Transaction refunds")).toBeInTheDocument();
    expect(screen.getByTestId("order-line-granted-refund-row")).toBeInTheDocument();
    expect(screen.getByText("DRAFT")).toBeInTheDocument();
    expect(screen.getByTestId("edit-granted-refund-button")).toBeInTheDocument();
    expect(screen.getByText("Edit & transfer")).toBeInTheDocument();
  });

  it("renders transfer failure message on failed transaction refund cards", () => {
    // Arrange
    const order = createOrderWithDraftRefund();
    const failedOrder = {
      ...order,
      grantedRefunds: [
        {
          ...order.grantedRefunds[0],
          status: OrderGrantedRefundStatusEnum.FAILURE,
          transactionEvents: [
            {
              __typename: "TransactionEvent" as const,
              id: "event-failure",
              type: TransactionEventTypeEnum.REFUND_FAILURE,
              message: "Refund amount exceeds captured amount",
              createdAt: "2026-07-13T12:46:00Z",
              pspReference: "psp-1",
              amount: { __typename: "Money" as const, amount: 25, currency: "USD" },
              externalUrl: "",
              reasonReference: null,
            },
          ],
        },
      ],
    };
    const lifecycle = buildOrderLineLifecycle(failedOrder)[0];

    // Act
    render(
      <MemoryRouter>
        <Wrapper>
          <OrderLineExpandedPanel {...defaultProps} lifecycle={lifecycle} order={failedOrder} />
        </Wrapper>
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByTestId("granted-refund-failure-info")).toBeInTheDocument();
    expect(screen.queryByText(/Transfer failed:/)).not.toBeInTheDocument();
  });
});
