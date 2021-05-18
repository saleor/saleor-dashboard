import { Card, CardContent, Divider } from "@material-ui/core";
import { BaseChannels_channels } from "@saleor/channels/types/BaseChannels";
import CardTitle from "@saleor/components/CardTitle";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import { FormChange } from "@saleor/hooks/useForm";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { FormData } from "../../components/ShippingZoneDetailsPage/types";
import ChannelsSection from "./ChannelsSection";
import WarehousesSection from "./WarehousesSection";

const messages = defineMessages({
  title: {
    defaultMessage: "Settings",
    description: "ShippingZoneSettingsCard title"
  }
});

export interface ShippingZoneSettingsCardProps {
  formData: FormData;
  warehousesDisplayValues: MultiAutocompleteChoiceType[];
  warehousesChoices: MultiAutocompleteChoiceType[];
  onWarehouseAdd: () => void;
  onWarehouseChange: FormChange;
  hasMoreWarehouses: boolean;
  onFetchMoreWarehouses: () => void;
  onWarehousesSearchChange: (query: string) => void;
  channelsDisplayValues: MultiAutocompleteChoiceType[];
  onChannelChange: FormChange;
  allChannels?: BaseChannels_channels[];
  loading: boolean;
}

export const ShippingZoneSettingsCard: React.FC<ShippingZoneSettingsCardProps> = ({
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
  channelsDisplayValues
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      {loading && (
        <CardContent>
          <Skeleton />
        </CardContent>
      )}

      {!loading && (
        <>
          <CardContent>
            <ChannelsSection
              channelsDisplayValues={channelsDisplayValues}
              onChange={onChannelChange}
              allChannels={allChannels}
              selectedChannels={formData.channels}
            />
          </CardContent>
          <Divider />
          <CardContent>
            <WarehousesSection
              onAdd={onWarehouseAdd}
              onSearchChange={onWarehousesSearchChange}
              onChange={onWarehouseChange}
              onFetchMore={onFetchMoreWarehouses}
              displayValues={warehousesDisplayValues}
              choices={warehousesChoices}
              selectedWarehouses={formData.warehouses}
              hasMore={hasMoreWarehouses}
              loading={false}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ShippingZoneSettingsCard;
