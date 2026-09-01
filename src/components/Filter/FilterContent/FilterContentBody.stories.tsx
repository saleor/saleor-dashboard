import { FieldType, type FilterElement } from "@dashboard/components/Filter/types";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FilterContentBody } from "./FilterContentBody";

const textFilter: FilterElement = {
  active: true,
  label: "Product name",
  multiple: false,
  name: "name",
  type: FieldType.text,
  value: ["Apple juice"],
};

const meta: Meta<typeof FilterContentBody> = {
  title: "Components/Filter/FilterContentBody",
  component: FilterContentBody,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="360px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    filter: textFilter,
    autocompleteDisplayValues: {},
    initialAutocompleteDisplayValues: {},
    setAutocompleteDisplayValues: fn(),
    onFilterPropertyChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FilterContentBody>;

export const Text: Story = {};

export const Boolean: Story = {
  args: {
    filter: {
      ...textFilter,
      label: "Published",
      name: "isPublished",
      type: FieldType.boolean,
      value: ["true"],
      options: [
        { label: "Published", value: "true" },
        { label: "Hidden", value: "false" },
      ],
    },
  },
};

export const Number: Story = {
  args: {
    filter: {
      ...textFilter,
      label: "Stock quantity",
      name: "stockQuantity",
      type: FieldType.number,
      value: ["10"],
    },
  },
};

export const Date: Story = {
  args: {
    filter: {
      ...textFilter,
      label: "Created",
      name: "created",
      type: FieldType.date,
      value: ["2026-03-18"],
    },
  },
};

export const KeyValue: Story = {
  args: {
    filter: {
      ...textFilter,
      label: "Metadata",
      name: "metadata",
      type: FieldType.keyValue,
      value: [{ key: "supplier", value: "acme" }],
    },
  },
};

export const Loading: Story = {
  name: "Loading (no filter)",
  args: { filter: undefined as unknown as FilterElement },
};
