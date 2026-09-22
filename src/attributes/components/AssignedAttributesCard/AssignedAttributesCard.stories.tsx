import { listActionsProps } from "@dashboard/fixtures";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { type AssignedAttributeListItem, AssignedAttributesCard } from "./AssignedAttributesCard";

const attributes: AssignedAttributeListItem[] = [
  {
    id: "1",
    name: "Color",
    slug: "color",
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: true,
  },
  {
    id: "2",
    name: "Size",
    slug: "size",
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
  },
  {
    id: "3",
    name: "Care instructions",
    slug: "care-instructions",
    inputType: AttributeInputTypeEnum.RICH_TEXT,
    valueRequired: false,
  },
];

const meta: Meta<typeof AssignedAttributesCard> = {
  title: "Attributes/AssignedAttributesCard",
  component: AssignedAttributesCard,
  args: {
    ...listActionsProps,
    attributes,
    disabled: false,
    title: "Product attributes",
    intro: "Attributes shown on every product of this type.",
    empty: "No attributes assigned yet.",
    cardTestId: "product-attributes",
    assignTestId: "assign-attributes",
    createTestId: "create-attribute",
    createOptionLabel: "Create new attribute",
    skeletonTestId: "product-attributes-skeleton",
    onAttributeAssign: fn(),
    onAttributeCreate: fn(),
    onAttributeReorder: fn(),
    onAttributeUnassign: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignedAttributesCard>;

export const Default: Story = {};

/** Rows selected — the header swaps in the bulk toolbar. */
export const WithSelection: Story = {
  args: {
    selected: 2,
    isChecked: (attribute: AssignedAttributeListItem) => attribute.id !== "3",
  },
};

/** `attributes` still undefined: skeleton rows hold the layout. */
export const Loading: Story = {
  args: { attributes: undefined, disabled: true },
};

export const Empty: Story = {
  args: { attributes: [] },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Variant attributes table reserves an extra column instead of a selection one. */
export const SpacerColumn: Story = {
  args: { variantColumn: "spacer" },
};
