import { taxClasses } from "@dashboard/taxes/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import TaxClassesPage from "./TaxClassesPage";

const noop = (): Promise<unknown[]> => Promise.resolve([]);

const meta: Meta<typeof TaxClassesPage> = {
  title: "Taxes/TaxClassesPage",
  component: TaxClassesPage,
  args: {
    taxClasses,
    selectedTaxClassId: taxClasses[0].id,
    savebarState: "default",
    disabled: false,
    handleTabChange: fn(),
    onCreateNewButtonClick: fn(),
    onTaxClassDelete: noop,
    onTaxClassCreate: noop,
    onTaxClassUpdate: noop,
  },
};

export default meta;
type Story = StoryObj<typeof TaxClassesPage>;

export const Default: Story = {};

/** Nothing fetched yet — both the tab list and the rate table show skeletons. */
export const Loading: Story = {
  args: { taxClasses: undefined, selectedTaxClassId: "", disabled: true },
};

export const Empty: Story = {
  args: { taxClasses: [], selectedTaxClassId: "" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
