import { AssignListAllDialog } from "@dashboard/components/AssignListCard/AssignListAllDialog";
import { messages as assignZoneMessages } from "@dashboard/components/AssignShippingZoneDialog/messages";
import { shippingZoneUrl } from "@dashboard/shipping/urls";
import { messages } from "@dashboard/warehouses/messages";
import {
  isZoneOutsideChannels,
  type ZoneChannelMembership,
} from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface WarehouseShippingZonesAllDialogProps {
  open: boolean;
  zones: ZoneChannelMembership[];
  loading: boolean;
  hasMore: boolean;
  warehouseChannelIds: string[];
  canManage: boolean;
  disabled: boolean;
  onFetchMore: () => void;
  onRemove: (zoneId: string) => void;
  onClose: () => void;
}

/** Every shipping zone linked to the warehouse, behind the card's show-all row. */
export const WarehouseShippingZonesAllDialog = ({
  open,
  zones,
  loading,
  hasMore,
  warehouseChannelIds,
  canManage,
  disabled,
  onFetchMore,
  onRemove,
  onClose,
}: WarehouseShippingZonesAllDialogProps): ReactNode => {
  const intl = useIntl();
  const channelIdSet = new Set(warehouseChannelIds);

  return (
    <AssignListAllDialog
      open={open}
      title={<FormattedMessage {...messages.zonesTitle} />}
      items={zones.map(zone => ({
        id: zone.id,
        name: zone.name,
        href: shippingZoneUrl(zone.id),
        description: isZoneOutsideChannels(zone, channelIdSet) ? (
          <FormattedMessage {...messages.zonesOutsideChannel} />
        ) : undefined,
      }))}
      loading={loading}
      hasMore={hasMore}
      onFetchMore={onFetchMore}
      searchLabel={intl.formatMessage(assignZoneMessages.searchLabel)}
      searchPlaceholder={intl.formatMessage(assignZoneMessages.searchPlaceholder)}
      noMatchMessage={<FormattedMessage {...assignZoneMessages.noShippingZonesFound} />}
      removable={canManage}
      removeLabel={() => intl.formatMessage(messages.zonesRemove)}
      disabled={disabled}
      onRemoveItem={onRemove}
      onClose={onClose}
      data-test-id="warehouse-shipping-zones-all"
    />
  );
};
