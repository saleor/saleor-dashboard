import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderManualTransactionForm } from "../OrderManualTransactionForm";
import { DescriptionField } from "./DescriptionField";

// DescriptionField reads its value from ManualTransactionContext.
const meta: Meta<typeof DescriptionField> = {
  title: "Orders/OrderManualTransactionForm/DescriptionField",
  component: DescriptionField,
  decorators: [
    (Story: StoryFn) => (
      <OrderManualTransactionForm
        currency="USD"
        submitState="default"
        error={undefined}
        onAddTransaction={fn()}
        initialData={{ description: "Refund issued over the phone" }}
      >
        <Box __maxWidth="480px" padding={4}>
          <Story />
        </Box>
      </OrderManualTransactionForm>
    ),
  ],
  args: { label: "Description" },
};

export default meta;

type Story = StoryObj<typeof DescriptionField>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: { error: true, helperText: "Description is too long" },
};
