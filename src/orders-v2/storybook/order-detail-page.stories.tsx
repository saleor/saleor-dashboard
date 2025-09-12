import { JobStatusEnum } from "@dashboard/graphql/types.generated";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrderFixture } from "../fixtures/order-fixture";
import { OrderDetailsPage } from "../order-detail-page";
import { StorybookAppLayout } from "./storybook-app-layout";

const meta = {
  title: "Order Detail Page",
  component: OrderDetailsPage,
  decorators: [
    Story => (
      <StorybookAppLayout>
        <Story />
      </StorybookAppLayout>
    ),
  ],
} satisfies Meta<typeof OrderDetailsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fulfilled: Story = {
  args: {
    order: OrderFixture.fulfilled().build(),
  },
};

const invoices = [
  {
    __typename: "Invoice" as const,
    id: "invoice-id-1",
    number: "INV-0001",
    status: JobStatusEnum.SUCCESS,
    createdAt: "2023-10-01T12:00:00Z",
    url: "https://example.com/invoice/1",
  },
  {
    __typename: "Invoice" as const,
    id: "invoice-id-2",
    number: "INV-0002",
    status: JobStatusEnum.SUCCESS,
    createdAt: "2023-10-01T12:00:00Z",
    url: "https://example.com/invoice/2",
  },
];

export const FulfilledWithInvoices: Story = {
  args: {
    order: OrderFixture.fulfilled().withInvoices(invoices).build(),
  },
};

export const FulfilledWithCustomerNote: Story = {
  args: {
    order: OrderFixture.fulfilled().withCustomerNote("This is a customer note.").build(),
  },
};

export const FulfilledWithMultipleFulfillments: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withRefundedFulfillment()
      .withReplacedFulfillment()
      .withReturnedFulfillment()
      .withWaitingForApprovalFulfillment()
      .withCanceledFulfillment()
      .withRefundedAndReturnedFulfillment()
      .build(),
  },
};

export const FulfilledWithGiftCards: Story = {
  args: {
    order: OrderFixture.fulfilled().withGiftCards().build(),
  },
};

export const Unconfirmed: Story = {
  args: {
    order: OrderFixture.unconfirmed().build(),
  },
};

export const UnconfirmedWithInvoices: Story = {
  args: {
    order: OrderFixture.unconfirmed().withInvoices(invoices).build(),
  },
};

export const UnconfirmedWithCustomerNote: Story = {
  args: {
    order: OrderFixture.unconfirmed().withCustomerNote("This is a customer note.").build(),
  },
};

export const Unfulfilled: Story = {
  args: {
    order: OrderFixture.unfulfilled().build(),
  },
};
