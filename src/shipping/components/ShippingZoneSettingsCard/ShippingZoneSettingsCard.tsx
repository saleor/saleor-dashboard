import { DashboardCard } from "@dashboard/components/Card";
import { type ChannelFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type WarehouseChoice } from "@dashboard/shipping/warehouseEligibility";
import { Divider, type Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { type ShippingZoneUpdateFormData } from "../../components/ShippingZoneDetailsPage/types";
import ChannelsSection from "./ChannelsSection";
import WarehousesSection from "./WarehousesSection";

const messages = defineMessages({
  title: {
    id: "t/R8nK",
    defaultMessage: "Settings",
    description: "ShippingZoneSettingsCard title",
  },
});

interface ShippingZoneSettingsCardProps {
  formData: ShippingZoneUpdateFormData;
  warehousesChoices: Option[];
  onWarehouseChange: FormChange;
  hasMoreWarehouses: boolean;
  onFetchMoreWarehouses: () => void;
  onWarehousesSearchChange: (query: string) => void;
  onChannelChange: FormChange;
  allChannels?: ChannelFragment[];
  loading: boolean;
  legacyStockAvailability: boolean | undefined;
  ineligibleWarehouses: WarehouseChoice[];
  zoneChannelNames: string[];
}

const ShippingZoneSettingsCard = ({
  formData,
  hasMoreWarehouses,
  loading,
  warehousesChoices,
  onFetchMoreWarehouses,
  onWarehousesSearchChange,
  onWarehouseChange,
  allChannels,
  onChannelChange,
  legacyStockAvailability,
  ineligibleWarehouses,
  zoneChannelNames,
}: ShippingZoneSettingsCardProps) => {
  const intl = useIntl();
  const [warehousesExpanded, setWarehousesExpanded] = useState(false);

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
          onSearchChange={onWarehousesSearchChange}
          onChange={onWarehouseChange}
          onFetchMore={onFetchMoreWarehouses}
          choices={warehousesChoices}
          selectedWarehouses={formData.warehouses}
          hasMore={hasMoreWarehouses}
          loading={loading}
          legacyStockAvailability={legacyStockAvailability}
          ineligibleWarehouses={ineligibleWarehouses}
          zoneChannelNames={zoneChannelNames}
          expanded={warehousesExpanded}
          onExpand={() => setWarehousesExpanded(true)}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default ShippingZoneSettingsCard;
