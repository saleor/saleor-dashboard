import CardTitle from "@dashboard/components/CardTitle";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { ChannelFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Card, CardContent, Divider } from "@material-ui/core";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ShippingZoneUpdateFormData } from "../../components/ShippingZoneDetailsPage/types";
import ChannelsSection from "./ChannelsSection";
import WarehousesSection from "./WarehousesSection";

const messages = defineMessages({
  title: {
    id: "t/R8nK",
    defaultMessage: "Settings",
    description: "ShippingZoneSettingsCard title",
  },
});

export interface ShippingZoneSettingsCardProps {
  formData: ShippingZoneUpdateFormData;
  warehousesDisplayValues: MultiAutocompleteChoiceType[];
  warehousesChoices: MultiAutocompleteChoiceType[];
  onWarehouseAdd: () => void;
  onWarehouseChange: FormChange;
  hasMoreWarehouses: boolean;
  onFetchMoreWarehouses: () => void;
  onWarehousesSearchChange: (query: string) => void;
  channelsDisplayValues: MultiAutocompleteChoiceType[];
  onChannelChange: FormChange;
  allChannels?: ChannelFragment[];
  loading: boolean;
}

export const ShippingZoneSettingsCard: React.FC<
  ShippingZoneSettingsCardProps
> = ({
  formData,
  warehousesDisplayValues,
  hasMoreWarehouses,
  loading,
  warehousesChoices,
  onFetchMoreWarehouses,
  onWarehousesSearchChange,
  onWarehouseAdd,
  onWarehouseChange,
  allChannels,
  onChannelChange,
  channelsDisplayValues,
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent data-test-id="channel-section">
        <ChannelsSection
          channelsDisplayValues={channelsDisplayValues}
          onChange={onChannelChange}
          allChannels={allChannels}
          selectedChannels={formData.channels}
        />
      </CardContent>
      <Divider />
      <CardContent data-test-id="warehouse-section">
        <WarehousesSection
          onAdd={onWarehouseAdd}
          onSearchChange={onWarehousesSearchChange}
          onChange={onWarehouseChange}
          onFetchMore={onFetchMoreWarehouses}
          displayValues={warehousesDisplayValues}
          choices={warehousesChoices}
          selectedWarehouses={formData.warehouses}
          hasMore={hasMoreWarehouses}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default ShippingZoneSettingsCard;
