import { taxCountryConfigurations } from "@dashboard/taxes/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import TaxCountriesPage from "./TaxCountriesPage";

const noop = (): Promise<unknown[]> => Promise.resolve([]);

const meta: Meta<typeof TaxCountriesPage> = {
  title: "Taxes/TaxCountriesPage",
  component: TaxCountriesPage,
  args: {
    countryTaxesData: taxCountryConfigurations,
    selectedCountryId: taxCountryConfigurations[0].country.code,
    savebarState: "default",
    disabled: false,
    handleTabChange: fn(),
    openDialog: fn(),
    onSubmit: noop,
    onDeleteConfiguration: noop,
  },
};

export default meta;
type Story = StoryObj<typeof TaxCountriesPage>;

export const Default: Story = {};

export const Loading: Story = {
  args: { countryTaxesData: undefined, selectedCountryId: "", disabled: true },
};

export const Empty: Story = {
  args: { countryTaxesData: [], selectedCountryId: "" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
