import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import FilterAutocompleteField, {
  type FilterAutocompleteDisplayValues,
} from "./FilterAutocompleteField";
import { FieldType, type FilterElementGeneric } from "./types";

const filter: FilterElementGeneric<string, FieldType.autocomplete> = {
  active: true,
  label: "Collections",
  multiple: true,
  name: "collections",
  type: FieldType.autocomplete,
  value: ["collection-1"],
  options: [
    { label: "Summer sale", value: "collection-1" },
    { label: "Winter sale", value: "collection-2" },
    { label: "Featured", value: "collection-3" },
  ],
  onSearchChange: fn(),
};

const displayValues: FilterAutocompleteDisplayValues = {
  collections: [
    { label: "Summer sale", value: "collection-1" },
    { label: "Winter sale", value: "collection-2" },
  ],
};

const meta: Meta<typeof FilterAutocompleteField> = {
  title: "Components/Filter/FilterAutocompleteField",
  component: FilterAutocompleteField,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="360px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    filter,
    displayValues,
    initialDisplayValues: displayValues,
    setDisplayValues: fn(),
    onFilterPropertyChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FilterAutocompleteField>;

export const Default: Story = {};

export const NoSelection: Story = {
  args: { filter: { ...filter, value: [] }, displayValues: { collections: [] } },
};

export const NoResults: Story = {
  args: {
    filter: { ...filter, value: [], options: [] },
    displayValues: { collections: [] },
    initialDisplayValues: { collections: [] },
  },
};
