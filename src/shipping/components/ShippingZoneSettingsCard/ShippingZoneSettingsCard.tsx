import { DashboardCard } from "@dashboard/components/Card";
import { ChannelFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Divider } from "@material-ui/core";
import { Option } from "@saleor/macaw-ui-next";
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
  warehousesChoices: Option[];
  onWarehouseAdd: () => void;
  onWarehouseChange: FormChange;
  hasMoreWarehouses: boolean;
  onFetchMoreWarehouses: () => void;
  onWarehousesSearchChange: (query: string) => void;
  onChannelChange: FormChange;
  allChannels?: ChannelFragment[];
  loading: boolean;
}

export const ShippingZoneSettingsCard = ({
  formData,
  hasMoreWarehouses,
  loading,
  warehousesChoices,
  onFetchMoreWarehouses,
  onWarehousesSearchChange,
  onWarehouseAdd,
  onWarehouseChange,
  allChannels,
  onChannelChange,
}: ShippingZoneSettingsCardProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.title)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content data-test-id="channel-section">
        <ChannelsSection
          onChange={onChannelChange}
          allChannels={allChannels}
          selectedChannels={formData.channels}
        />
      </DashboardCard.Content>
      <Divider />
      <DashboardCard.Content data-test-id="warehouse-section">
        <WarehousesSection
          onAdd={onWarehouseAdd}
          onSearchChange={onWarehousesSearchChange}
          onChange={onWarehouseChange}
          onFetchMore={onFetchMoreWarehouses}
          choices={warehousesChoices}
          selectedWarehouses={formData.warehouses}
          hasMore={hasMoreWarehouses}
          loading={loading}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default ShippingZoneSettingsCard;
