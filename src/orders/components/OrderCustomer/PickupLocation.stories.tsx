import { type ReadonlyAddressData } from "@dashboard/components/ReadonlyAddress/types";
import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PickupLocation } from "./PickupLocation";

const warehouseAddress: ReadonlyAddressData = {
  firstName: "Regina",
  lastName: "Larson",
  companyName: "",
  phone: "+1 212 555 0142",
  streetAddress1: "799 Cedar Ln",
  streetAddress2: "",
  city: "NEW YORK",
  postalCode: "10001",
  countryArea: "NY",
  country: {
    code: "US",
    country: "United States of America",
  },
};

const meta: Meta<typeof PickupLocation> = {
  title: "Orders/PickupLocation",
  component: PickupLocation,
  args: {
    name: "Default for click and collect",
    address: warehouseAddress,
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
  },
};

export default meta;
type Story = StoryObj<typeof PickupLocation>;

export const LocalStock: Story = {};

export const AnyWarehouse: Story = {
  args: {
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.ALL,
  },
};

export const WithoutLocationName: Story = {
  args: {
    name: null,
  },
};
