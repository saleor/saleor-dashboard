import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderManualTransactionForm } from "../OrderManualTransactionForm";
import { PspReferenceField } from "./PspReferenceField";

// PspReferenceField reads its value from ManualTransactionContext.
const meta: Meta<typeof PspReferenceField> = {
  title: "Orders/OrderManualTransactionForm/PspReferenceField",
  component: PspReferenceField,
  decorators: [
    (Story: StoryFn) => (
      <OrderManualTransactionForm
        currency="USD"
        submitState="default"
        error={undefined}
        onAddTransaction={fn()}
        initialData={{ pspReference: "psp-123456" }}
      >
        <Box __maxWidth="480px" padding={4}>
          <Story />
        </Box>
      </OrderManualTransactionForm>
    ),
  ],
  args: { label: "PSP reference" },
};

export default meta;

type Story = StoryObj<typeof PspReferenceField>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: { error: true, helperText: "Reference already used" },
};
