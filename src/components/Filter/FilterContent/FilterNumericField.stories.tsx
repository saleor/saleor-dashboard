import { FieldType, type FilterElementGeneric } from "@dashboard/components/Filter/types";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FilterNumericField } from "./FilterNumericField";

const numberFilter: FilterElementGeneric<string, FieldType.number> = {
  active: true,
  label: "Stock quantity",
  multiple: false,
  name: "stockQuantity",
  type: FieldType.number,
  value: ["10"],
};

const meta: Meta<typeof FilterNumericField> = {
  title: "Components/Filter/FilterNumericField",
  component: FilterNumericField,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="360px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    filter: numberFilter,
    currencySymbol: undefined,
    onFilterPropertyChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FilterNumericField>;

export const Single: Story = {};

export const Range: Story = {
  args: { filter: { ...numberFilter, multiple: true, value: ["10", "50"] } },
};

export const Price: Story = {
  args: {
    currencySymbol: "USD",
    filter: {
      ...numberFilter,
      label: "Price",
      name: "price",
      type: FieldType.price,
      value: ["9.99"],
    } as FilterElementGeneric<string, FieldType.price>,
  },
};

export const PriceRange: Story = {
  args: {
    currencySymbol: "USD",
    filter: {
      ...numberFilter,
      label: "Price",
      name: "price",
      type: FieldType.price,
      multiple: true,
      value: ["9.99", "49.99"],
    } as FilterElementGeneric<string, FieldType.price>,
  },
};
