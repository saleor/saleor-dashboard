import { listActionsProps } from "@dashboard/fixtures";
import { AttributeInputTypeEnum, type AttributeValueListFragment } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { AttributeValues } from "./AttributeValues";

type Value = RelayToFlat<AttributeValueListFragment>[number];

const value = (id: string, name: string, swatch?: string): Value => ({
  __typename: "AttributeValue",
  id,
  name,
  slug: name.toLowerCase(),
  plainText: null,
  richText: null,
  reference: null,
  boolean: null,
  date: null,
  dateTime: null,
  value: swatch ?? null,
  file: null,
});

const values: Value[] = [
  value("1", "Red", "#ef4444"),
  value("2", "Green", "#22c55e"),
  value("3", "Blue", "#3b82f6"),
];

const meta: Meta<typeof AttributeValues> = {
  title: "Attributes/AttributeValues",
  component: AttributeValues,
  args: {
    ...listActionsProps,
    disabled: false,
    values,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    pageInfo: { hasNextPage: false, hasPreviousPage: false },
    onNextPage: fn(),
    onPreviousPage: fn(),
    onValueAdd: fn(),
    onValueDelete: fn(),
    onValueReorder: fn(),
    onValueUpdate: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AttributeValues>;

/** Standalone card on the attribute detail page. */
export const Default: Story = {};

/** Swatch attributes gain a preview column. */
export const Swatch: Story = {
  args: { inputType: AttributeInputTypeEnum.SWATCH },
};

/** Rendered inside another card (attribute create), so it drops its own chrome. */
export const Embedded: Story = {
  args: { variant: "embedded", attributeName: "Color" },
};

/** Values are typed straight into the table footer instead of a dialog. */
export const InlineAdd: Story = {
  args: { addMode: "inline", onInlineValueAdd: fn(), onInlineValuesAdd: fn() },
};

export const Loading: Story = {
  args: { values: undefined, disabled: true },
};

export const Empty: Story = {
  args: { values: [] },
};

export const WithSearch: Story = {
  args: { searchQuery: "re", onSearchChange: fn() },
};

export const Paginated: Story = {
  args: { pageInfo: { hasNextPage: true, hasPreviousPage: true } },
};
