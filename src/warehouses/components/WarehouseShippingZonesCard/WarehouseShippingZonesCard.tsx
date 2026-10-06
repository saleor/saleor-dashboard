import { AssignListCard } from "@dashboard/components/AssignListCard/AssignListCard";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { shippingZonesListUrl, shippingZoneUrl } from "@dashboard/shipping/urls";
import { messages } from "@dashboard/warehouses/messages";
import {
  warehouseZonesGuidance,
  type ZoneChannelMembership,
} from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { Button } from "@saleor/macaw-ui-next";
import { Truck } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface WarehouseShippingZonesCardProps {
  /** Undefined while the shop stock mode is still loading. */
  legacyStockAvailability: boolean | undefined;
  zones: ZoneChannelMembership[];
  totalCount: number | null;
  loading?: boolean;
  membershipStatus: "loading" | "error" | "ready";
  warehouseChannelIds: string[];
  channelNames: string[];
  pickupEnabled: boolean;
  canManage: boolean;
  disabled?: boolean;
  onRequestAssign: () => void;
  onRemove: (zoneId: string) => void;
}

const channelList = (names: string[]): string => {
  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names[0]} +${names.length - 1}`;
};

const zoneIntro = (
  kind: ReturnType<typeof warehouseZonesGuidance>["kind"],
  channelNames: string[],
  pickupWithoutZone: boolean,
): ReactNode => {
  if (kind === "loading" || kind === "hidden") {
    return null;
  }

  return (
    <>
      {kind === "direct" ? <FormattedMessage {...messages.zonesDirectIntro} /> : null}
      {kind === "legacy-need-channel" ? <FormattedMessage {...messages.zonesNeedChannel} /> : null}
      {kind === "legacy-unknown" ? <FormattedMessage {...messages.zonesUnknown} /> : null}
      {kind === "legacy-need-zone" ? (
        <FormattedMessage
          {...messages.zonesNeedZone}
          values={{ channels: channelList(channelNames) }}
        />
      ) : null}
      {kind === "legacy-linked" ? <FormattedMessage {...messages.zonesLegacyIntro} /> : null}
      {pickupWithoutZone ? (
        <>
          {" "}
          <FormattedMessage {...messages.zonesPickupWithoutZone} />
        </>
      ) : null}
    </>
  );
};

export const WarehouseShippingZonesCard = ({
  legacyStockAvailability,
  zones,
  totalCount,
  loading = false,
  membershipStatus,
  warehouseChannelIds,
  channelNames,
  pickupEnabled,
  canManage,
  disabled = false,
  onRequestAssign,
  onRemove,
}: WarehouseShippingZonesCardProps): ReactNode => {
  const intl = useIntl();
  const guidance = warehouseZonesGuidance({
    legacyStockAvailability: loading ? undefined : legacyStockAvailability,
    hasZones: zones.length > 0,
    membershipStatus: loading ? "loading" : membershipStatus,
    channelNames,
    zones,
    warehouseChannelIds,
  });

  if (guidance.kind === "hidden") {
    return null;
  }

  const count = totalCount ?? zones.length;
  const hiddenCount = Math.max(count - zones.length, 0);
  const canAssign =
    canManage &&
    guidance.kind !== "loading" &&
    guidance.kind !== "legacy-need-channel" &&
    guidance.kind !== "legacy-unknown";
  const outside = new Set(guidance.kind === "legacy-linked" ? guidance.outsideChannelZoneIds : []);

  return (
    <AssignListCard
      data-test-id="warehouse-shipping-zones"
      title={<FormattedMessage {...messages.zonesTitle} />}
      subtitle={
        guidance.kind === "loading" ? null : count === 0 ? (
          <FormattedMessage {...messages.channelsRequired} />
        ) : (
          <FormattedMessage {...messages.channelsAssignedCount} values={{ count }} />
        )
      }
      loading={guidance.kind === "loading"}
      disabled={disabled}
      removable={canManage}
      intro={
        <>
          {zoneIntro(guidance.kind, channelNames, pickupEnabled && zones.length === 0)}
          {hiddenCount > 0 ? (
            <>
              {" "}
              <MicrocopyLink to={shippingZonesListUrl()}>
                <FormattedMessage {...messages.zonesMore} values={{ count: hiddenCount }} />
              </MicrocopyLink>
            </>
          ) : null}
        </>
      }
      items={zones.map(zone => ({
        id: zone.id,
        name: zone.name,
        href: shippingZoneUrl(zone.id),
        description: outside.has(zone.id) ? (
          <FormattedMessage {...messages.zonesOutsideChannel} />
        ) : undefined,
      }))}
      emptyState={{
        icon: <Truck size={iconSize.small} strokeWidth={iconStrokeWidth} />,
        title:
          guidance.kind === "legacy-need-channel" ? (
            <FormattedMessage {...messages.channelsEmptyTitle} />
          ) : (
            <FormattedMessage {...messages.zonesEmptyTitle} />
          ),
        description:
          guidance.kind === "legacy-need-channel" ? (
            <FormattedMessage {...messages.channelsEmptyDescription} />
          ) : (
            <FormattedMessage {...messages.zonesEmptyDescription} />
          ),
      }}
      removeLabel={intl.formatMessage(messages.zonesRemove)}
      onRemoveItem={onRemove}
      footerAction={
        canAssign ? (
          <Button
            variant="secondary"
            type="button"
            size="small"
            disabled={disabled}
            data-test-id="warehouse-zones-add"
            onClick={onRequestAssign}
          >
            <FormattedMessage {...messages.channelsAdd} />
          </Button>
        ) : undefined
      }
    />
  );
};

WarehouseShippingZonesCard.displayName = "WarehouseShippingZonesCard";
