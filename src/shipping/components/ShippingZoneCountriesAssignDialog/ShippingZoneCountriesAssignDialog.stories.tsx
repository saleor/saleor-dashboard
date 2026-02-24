import { CountryWithCodeFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ShippingZoneCountriesAssignDialog from "./ShippingZoneCountriesAssignDialog";

const countries: CountryWithCodeFragment[] = [
  { __typename: "CountryDisplay", code: "US", country: "United States" },
  { __typename: "CountryDisplay", code: "GB", country: "United Kingdom" },
  { __typename: "CountryDisplay", code: "DE", country: "Germany" },
  { __typename: "CountryDisplay", code: "FR", country: "France" },
  { __typename: "CountryDisplay", code: "CA", country: "Canada" },
  { __typename: "CountryDisplay", code: "AU", country: "Australia" },
  { __typename: "CountryDisplay", code: "JP", country: "Japan" },
  { __typename: "CountryDisplay", code: "BR", country: "Brazil" },
  { __typename: "CountryDisplay", code: "IN", country: "India" },
  { __typename: "CountryDisplay", code: "MX", country: "Mexico" },
];

const meta: Meta<typeof ShippingZoneCountriesAssignDialog> = {
  title: "Components/Dialogs/ShippingZoneCountriesAssignDialog",
  component: ShippingZoneCountriesAssignDialog,
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onConfirm: { table: { disable: true } },
    countries: { table: { disable: true } },
    restWorldCountries: { table: { disable: true } },
    initial: { table: { disable: true } },
  },
  args: {
    open: true,
    confirmButtonState: "default",
    countries,
    restWorldCountries: ["AF", "AL", "DZ"],
    initial: [],
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ShippingZoneCountriesAssignDialog>;

export const Default: Story = {};

export const WithPreselected: Story = {
  args: { initial: ["US", "GB"] },
};
