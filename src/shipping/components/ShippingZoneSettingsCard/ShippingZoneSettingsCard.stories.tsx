import { ChannelDetailsFragment } from "@saleor/graphql";
import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { ShippingZoneUpdateFormData } from "../../components/ShippingZoneDetailsPage/types";
import ShippingZoneSettingsCard, {
  ShippingZoneSettingsCardProps,
} from "./ShippingZoneSettingsCard";

const props: ShippingZoneSettingsCardProps = {
  formData: {
    channels: ["channel1"],
    warehouses: ["warehouse1", "warehouse2"],
  } as ShippingZoneUpdateFormData,
  warehousesDisplayValues: [
    {
      value: "warehouse1",
      label: "Asia Warehouse",
    },
    {
      value: "warehouse2",
      label: "Europe Warehouse",
    },
  ],
  hasMoreWarehouses: false,
  loading: false,
  onWarehouseChange: () => undefined,
  onFetchMoreWarehouses: () => undefined,
  onWarehousesSearchChange: () => undefined,
  onWarehouseAdd: () => undefined,
  warehousesChoices: [
    {
      value: "warehouse1",
      label: "C our wares",
    },
    {
      value: "warehouse2",
      label: "Be stocked",
    },
  ],
  allChannels: [
    { __typename: "Channel", id: "channel1", name: "GBP" },
    { __typename: "Channel", id: "channel2", name: "PLN" },
    { __typename: "Channel", id: "channel3", name: "USD" },
  ] as ChannelDetailsFragment[],
  channelsDisplayValues: [
    {
      value: "channel1",
      label: "GBP",
    },
  ],
  onChannelChange: () => undefined,
};

storiesOf("Shipping zones details / Settings Card", module)
  .addDecorator(CommonDecorator)
  .addDecorator(CentralPlacementDecorator)
  .add("default", () => <ShippingZoneSettingsCard {...props} />);
