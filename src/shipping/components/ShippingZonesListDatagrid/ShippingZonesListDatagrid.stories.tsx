import { shippingZones } from "@dashboard/shipping/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { ShippingZoneListDatagrid } from "./ShippingZonesListDatagrid";

const meta: Meta<typeof ShippingZoneListDatagrid> = {
  title: "Shipping/ShippingZonesListDatagrid",
  component: ShippingZoneListDatagrid,

  args: {
    shippingZones,
    disabled: false,
    settings: { columns: ["name", "priceRange", "countries"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectShippingZones: fn(),
  },
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
  },
};

export default meta;
type Story = StoryObj<typeof ShippingZoneListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { shippingZones: [] },
};
