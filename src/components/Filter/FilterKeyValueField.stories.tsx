import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FilterKeyValueField } from "./FilterKeyValueField";
import { FieldType, type FilterElementGeneric } from "./types";

const filter: FilterElementGeneric<string, FieldType.keyValue> = {
  active: true,
  label: "Metadata",
  multiple: false,
  name: "metadata",
  type: FieldType.keyValue,
  value: [{ key: "supplier", value: "acme" }],
};

const meta: Meta<typeof FilterKeyValueField> = {
  title: "Components/Filter/FilterKeyValueField",
  component: FilterKeyValueField,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="480px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    filter,
    onFilterPropertyChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FilterKeyValueField>;

export const Default: Story = {};

export const Empty: Story = { args: { filter: { ...filter, value: [] } } };

export const MultiplePairs: Story = {
  args: {
    filter: {
      ...filter,
      value: [
        { key: "supplier", value: "acme" },
        { key: "warehouse", value: "eu-1" },
        { key: "batch", value: "2026-03" },
      ],
    },
  },
};
