import { JobStatusEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrderInvoices } from "../order-invoices";

const meta = {
  title: "Order Detail Page / Right Sidebar / Invoices",
  component: OrderInvoices,
  decorators: [
    Story => (
      <Box __maxWidth="400px">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof OrderInvoices>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithMultipleInvoices: Story = {
  args: {
    invoices: [
      {
        __typename: "Invoice",
        id: "invoice-id-1",
        number: "INV-0001",
        status: JobStatusEnum.SUCCESS,
        createdAt: "2023-10-01T12:00:00Z",
        url: "https://example.com/invoice/1",
      },
      {
        __typename: "Invoice",
        id: "invoice-id-2",
        number: "INV-0002",
        status: JobStatusEnum.SUCCESS,
        createdAt: "2023-10-02T12:00:00Z",
        url: "https://example.com/invoice/2",
      },
    ],
  },
};

export const WithSingleInvoice: Story = {
  args: {
    invoices: [
      {
        __typename: "Invoice",
        id: "invoice-id-1",
        number: "INV-0001",
        status: JobStatusEnum.SUCCESS,
        createdAt: "2023-10-01T12:00:00Z",
        url: "https://example.com/invoice/1",
      },
    ],
  },
};

export const WithNoInvoices: Story = {
  args: {
    invoices: [],
  },
};
