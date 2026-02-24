import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { AssignReferenceTypesDialog, ReferenceTypes } from "./AssignReferenceTypesDialog";

const referenceTypes: ReferenceTypes = [
  { id: "pt-1", name: "Simple Product" },
  { id: "pt-2", name: "Digital Product" },
  { id: "pt-3", name: "Gift Card" },
];

const meta: Meta<typeof AssignReferenceTypesDialog> = {
  title: "Components/Dialogs/AssignReferenceTypesDialog",
  component: AssignReferenceTypesDialog,
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onFetch: { table: { disable: true } },
    onFetchMore: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    referenceTypes: { table: { disable: true } },
    selectedReferenceTypesIds: { table: { disable: true } },
    entityType: { table: { disable: true } },
    labels: { table: { disable: true } },
  },
  args: {
    open: true,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    referenceTypes,
    selectedReferenceTypesIds: [],
    entityType: AttributeEntityTypeEnum.PRODUCT,
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignReferenceTypesDialog>;

export const Default: Story = {};

export const PageTypes: Story = {
  args: { entityType: AttributeEntityTypeEnum.PAGE },
};

export const Empty: Story = {
  args: { referenceTypes: [] },
};
