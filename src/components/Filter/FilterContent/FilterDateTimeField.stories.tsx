import { FieldType, type FilterElementGeneric } from "@dashboard/components/Filter/types";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FilterDateTimeField } from "./FilterDateTimeField";

const dateFilter: FilterElementGeneric<string, FieldType.date> = {
  active: true,
  label: "Created",
  multiple: false,
  name: "created",
  type: FieldType.date,
  value: ["2026-03-18"],
};

const dateTimeFilter: FilterElementGeneric<string, FieldType.dateTime> = {
  ...dateFilter,
  type: FieldType.dateTime,
  value: ["2026-03-18T09:31:00"],
};

const meta: Meta<typeof FilterDateTimeField> = {
  title: "Components/Filter/FilterDateTimeField",
  component: FilterDateTimeField,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="420px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    filter: dateFilter,
    onFilterPropertyChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FilterDateTimeField>;

export const Date: Story = {};

export const DateRange: Story = {
  args: { filter: { ...dateFilter, multiple: true, value: ["2026-03-01", "2026-03-31"] } },
};

export const DateTime: Story = { args: { filter: dateTimeFilter } };

export const DateTimeRange: Story = {
  args: {
    filter: {
      ...dateTimeFilter,
      multiple: true,
      value: ["2026-03-01T08:00:00", "2026-03-31T20:00:00"],
    },
  },
};
