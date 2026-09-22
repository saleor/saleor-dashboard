import { invoices } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import OrderInvoiceList from "./OrderInvoiceList";

const meta: Meta<typeof OrderInvoiceList> = {
  title: "Orders/OrderInvoiceList",
  component: OrderInvoiceList,
  args: {
    invoices,
    onInvoiceClick: fn(),
    onInvoiceGenerate: fn(),
    onInvoiceSend: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderInvoiceList>;

export const Default: Story = {};

/** Invoices still generating are filtered out, so the list reads as empty. */
export const Pending: Story = {
  args: { invoices: invoices.map(invoice => ({ ...invoice, status: "PENDING" })) },
};

export const Loading: Story = {
  args: { invoices: undefined },
};

export const Empty: Story = {
  args: { invoices: [] },
};

/** Without a generate handler the card drops its action button. */
export const WithoutGenerate: Story = {
  args: { onInvoiceGenerate: undefined },
};
