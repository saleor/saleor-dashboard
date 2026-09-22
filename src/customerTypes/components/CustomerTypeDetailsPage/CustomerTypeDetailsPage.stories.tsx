import { customerType, defaultCustomerType } from "@dashboard/customerTypes/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CustomerTypeDetailsPage } from "./CustomerTypeDetailsPage";

const meta: Meta<typeof CustomerTypeDetailsPage> = {
  title: "Customer types / CustomerTypeDetailsPage",
  component: CustomerTypeDetailsPage,
};

export default meta;

type Story = StoryObj<typeof CustomerTypeDetailsPage>;

const defaultArgs = {
  disabled: false,
  errors: [],
  saveButtonBarState: "default" as const,
  attributeList: {
    isChecked: () => false,
    selected: 0,
    toggle: () => undefined,
    toggleAll: () => undefined,
    toolbar: null,
  },
  onAttributeAdd: () => undefined,
  onAttributeCreate: () => undefined,
  onAttributeReorder: () => undefined,
  onAttributeUnassign: () => undefined,
  onDelete: () => undefined,
  onSetDefault: () => undefined,
  onShowMetadata: () => undefined,
  onSubmit: () => undefined,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    customerType,
  },
};

export const DefaultType: Story = {
  args: {
    ...defaultArgs,
    customerType: defaultCustomerType,
  },
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    customerType: undefined,
  },
};
