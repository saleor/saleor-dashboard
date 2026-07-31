import { OrderAction, TransactionActionEnum } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { OrderDetailsStoryHarness } from "./OrderDetailsStoryHarness";

const meta: Meta<typeof OrderDetailsStoryHarness> = {
  title: "Orders / OrderDetails page",
  component: OrderDetailsStoryHarness,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof OrderDetailsStoryHarness>;
type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// Legacy: has payments and no transactions -> Payments API view.
export const LegacyNormal: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withLegacyPayments()
      .withActions([OrderAction.CAPTURE, OrderAction.REFUND, OrderAction.VOID])
      .build(),
  },
};

export const LegacyUnconfirmed: Story = {
  args: {
    order: OrderFixture.unconfirmed()
      .withLegacyPayments()
      .withActions([OrderAction.MARK_AS_PAID])
      .build(),
  },
};

// Transactions: has transactions -> Transactions API view.
export const TransactionNormal: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withTransaction()
      .withActions([OrderAction.MARK_AS_PAID])
      .build(),
  },
};

export const TransactionUnconfirmed: Story = {
  args: {
    order: OrderFixture.unconfirmed().withTransaction().build(),
  },
};

// Hybrid: both payments and transactions -> Transactions API view wins,
// historical legacy payment data stays visible.
export const HybridNormal: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withLegacyPayments()
      .withTransaction()
      .withActions([OrderAction.MARK_AS_PAID])
      .build(),
  },
};

// -----------------------------------------------------------------------------
// Interaction suite (must run unchanged after the legacy/transaction view split).
// These stories carry `play` assertions and are intentionally separate from the
// static screenshot scenarios above so before/after captures stay clean.
// -----------------------------------------------------------------------------

// 1. Legacy payment actions: capture / void / refund / mark-as-paid affordances
//    invoke their respective legacy callbacks.
export const LegacyActionsInteraction: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withLegacyPayments()
      .withActions([
        OrderAction.CAPTURE,
        OrderAction.VOID,
        OrderAction.REFUND,
        OrderAction.MARK_AS_PAID,
      ])
      .build(),
    onPaymentCapture: fn(),
    onPaymentVoid: fn(),
    onPaymentRefund: fn(),
    onMarkAsPaid: fn(),
  },
  play: async ({ args, canvasElement }: PlayContext) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act + Assert
    await userEvent.click(canvas.getByRole("button", { name: "Capture" }));
    await expect(args.onPaymentCapture).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole("button", { name: "Void" }));
    await expect(args.onPaymentVoid).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByTestId("refund-button"));
    await expect(args.onPaymentRefund).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByTestId("mark-as-paid-button"));
    await expect(args.onMarkAsPaid).toHaveBeenCalledTimes(1);
  },
};

// 2. Transaction actions: a transaction's primary action fires
//    onTransactionAction with the selected transaction id and action type.
export const TransactionActionsInteraction: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withTransaction({ actions: [TransactionActionEnum.CHARGE] })
      .build(),
    onTransactionAction: fn(),
  },
  play: async ({ args, canvasElement }: PlayContext) => {
    // Arrange
    const canvas = within(canvasElement);
    const transactionId = args.order.transactions[0].id;

    // Act
    await userEvent.click(await canvas.findByTestId("transaction-action-charge-button"));

    // Assert
    await expect(args.onTransactionAction).toHaveBeenCalledWith(
      transactionId,
      TransactionActionEnum.CHARGE,
    );
  },
};

// 3. Manual transaction: opening the manual-transaction flow is wired up.
export const ManualTransactionInteraction: Story = {
  args: {
    order: OrderFixture.fulfilled().withTransaction().build(),
    onAddManualTransaction: fn(),
  },
  play: async ({ args, canvasElement }: PlayContext) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(await canvas.findByTestId("captureManualTransactionButton"));

    // Assert
    await expect(args.onAddManualTransaction).toHaveBeenCalledTimes(1);
  },
};

// 4. Refund / return navigation: page refund (grant) and return affordances
//    route to their handlers. Exact refund URLs are covered by
//    getOrderRefundNavigation.test.ts (the stable home for URL logic).
export const RefundAndReturnInteraction: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withTransaction({ actions: [TransactionActionEnum.REFUND] })
      .build(),
    onRefundAdd: fn(),
    onOrderReturn: fn(),
  },
  play: async ({ args, canvasElement }: PlayContext) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act + Assert
    await userEvent.click(await canvas.findByTestId("add-new-refund-button"));
    await expect(args.onRefundAdd).toHaveBeenCalledTimes(1);

    await userEvent.click(await canvas.findByTestId("order-items-return-button"));
    await expect(args.onOrderReturn).toHaveBeenCalledTimes(1);
  },
};

// 5. General order-detail navigation: a payment-neutral action (order metadata).
export const OrderNavigationInteraction: Story = {
  args: {
    order: OrderFixture.fulfilled().withTransaction().build(),
    onOrderShowMetadata: fn(),
  },
  play: async ({ args, canvasElement }: PlayContext) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(await canvas.findByTestId("show-order-metadata"));

    // Assert
    await expect(args.onOrderShowMetadata).toHaveBeenCalledTimes(1);
  },
};

// 6. Hybrid precedence: with both payments and transactions the Transactions
//    view is selected (legacy summary action buttons are not rendered).
export const HybridInteraction: Story = {
  args: {
    order: OrderFixture.fulfilled().withLegacyPayments().withTransaction().build(),
  },
  play: async ({ canvasElement }: PlayContext) => {
    // Arrange
    const canvas = within(canvasElement);

    // Assert: transaction view chosen ...
    const transactionCards = await canvas.findAllByTestId("orderTransactionsList");

    await expect(transactionCards.length).toBeGreaterThan(0);
    // ... and the legacy Payments-API refund button is absent.
    await expect(canvas.queryByTestId("refund-button")).not.toBeInTheDocument();
  },
};
