import { type Meta, type StoryObj } from "@storybook/react-vite";

import { ReadonlyAddress } from "./ReadonlyAddress";
import { type ReadonlyAddressData } from "./types";

const sampleAddress: ReadonlyAddressData = {
  firstName: "Miroslaw",
  lastName: "Mencel",
  companyName: "Saleor Commerce, Inc.",
  phone: "+48 602 526 391",
  streetAddress1: "South Dupont Highway",
  streetAddress2: "Suite GW-101",
  city: "DOVER",
  postalCode: "19901",
  countryArea: "DE",
  country: {
    code: "US",
    country: "United States of America",
  },
};

const meta: Meta<typeof ReadonlyAddress> = {
  title: "Components/ReadonlyAddress",
  component: ReadonlyAddress,
};

export default meta;

type Story = StoryObj<typeof ReadonlyAddress>;

export const Default: Story = {
  args: {
    address: sampleAddress,
    variant: "default",
  },
};

export const Compact: Story = {
  args: {
    address: sampleAddress,
    variant: "compact",
  },
};
