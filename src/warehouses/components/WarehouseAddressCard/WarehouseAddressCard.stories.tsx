import { type AddressTypeInput } from "@dashboard/customers/types";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { withApolloMocks } from "@storybookUtils/apollo";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { WarehouseAddressCard } from "./WarehouseAddressCard";

const data: AddressTypeInput = {
  city: "Berlin",
  companyName: "Saleor Commerce",
  country: "DE",
  countryArea: "",
  phone: "+4930123456",
  postalCode: "10115",
  streetAddress1: "Invalidenstrasse 1",
  streetAddress2: "",
};

const meta: Meta<typeof WarehouseAddressCard> = {
  title: "Warehouses/WarehouseAddressCard",
  component: WarehouseAddressCard,
  decorators: [
    withApolloMocks([]),
    (Story: StoryFn): ReactElement => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    countries: [
      { label: "Germany", value: "DE" },
      { label: "Poland", value: "PL" },
    ],
    data,
    displayCountry: "Germany",
    disabled: false,
    errors: [],
    showPickupNotice: false,
    onChange: fn(),
    onCountryChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseAddressCard>;

export const Default: Story = {};

export const WithPickupNotice: Story = {
  args: { showPickupNotice: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
