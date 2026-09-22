import { AttributeInputTypeEnum, type AvailableAttributeFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import AssignAttributeDialog from "./AssignAttributeDialog";

const attributes: AvailableAttributeFragment[] = [
  {
    __typename: "Attribute",
    id: "1",
    name: "Color",
    slug: "color",
    inputType: AttributeInputTypeEnum.DROPDOWN,
  },
  {
    __typename: "Attribute",
    id: "2",
    name: "Size",
    slug: "size",
    inputType: AttributeInputTypeEnum.DROPDOWN,
  },
  {
    __typename: "Attribute",
    id: "3",
    name: "Care instructions",
    slug: "care-instructions",
    inputType: AttributeInputTypeEnum.RICH_TEXT,
  },
];

const meta: Meta<typeof AssignAttributeDialog> = {
  title: "Components/AssignAttributeDialog",
  component: AssignAttributeDialog,
  args: {
    open: true,
    confirmButtonState: "default",
    attributes,
    selected: ["2"],
    errors: [],
    hasMore: false,
    loading: false,
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onOpen: fn(),
    onSubmit: fn(),
    onToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignAttributeDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: { attributes: [], loading: true },
};

export const Empty: Story = {
  args: { attributes: [] },
};

export const WithErrors: Story = {
  args: { errors: ["Attribute already assigned to this product type"] },
};
