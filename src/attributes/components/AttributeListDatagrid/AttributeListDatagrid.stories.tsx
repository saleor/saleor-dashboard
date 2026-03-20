import { attributes } from "@dashboard/attributes/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { AttributeListDatagrid } from "./AttributeListDatagrid";

const meta: Meta<typeof AttributeListDatagrid> = {
  title: "Attributes/AttributeListDatagrid",
  component: AttributeListDatagrid,

  args: {
    attributes,
    disabled: false,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["slug", "name", "visible", "use-in-faceted-search"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectAttributesIds: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AttributeListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { attributes: [] },
};
