import type { Meta, StoryObj } from "@storybook/react-vite";

import { FixedAtCreationField } from "./FixedAtCreationField";

const meta: Meta<typeof FixedAtCreationField> = {
  title: "Components/FixedAtCreationField",
  component: FixedAtCreationField,
};

export default meta;
type Story = StoryObj<typeof FixedAtCreationField>;

export const Currency: Story = {
  args: {
    "data-test-id": "channel-currency-locked-input",
    helperText: "Fixed at creation. To sell in another currency, create a second channel.",
    label: "Currency",
    name: "currencyCode",
    value: "USD",
  },
};

export const AttributeType: Story = {
  args: {
    "data-test-id": "attribute-type-select",
    helperText: "Fixed at creation. To use a different type, create a new attribute.",
    label: "Catalog Input type for Store Owner",
    name: "inputType",
    value: "Dropdown",
  },
};
