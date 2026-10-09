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
import { FormattedMessage, type IntlShape, useIntl } from "react-intl";

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

const channelList = (intl: IntlShape, names: string[]): string => {
  if (names.length <= 2) {
    return intl.formatList(names, { type: "conjunction" });
  }

  return intl.formatMessage(messages.channelsFirstAndMore, {
    first: names[0],
    count: names.length - 1,
  });
};

const zoneIntro = (
  intl: IntlShape,
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
          values={{ channels: channelList(intl, channelNames) }}
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
  const count = totalCount ?? zones.length;
  const zonesTruncated = count > zones.length;
  const guidance = warehouseZonesGuidance({
    legacyStockAvailability: loading ? undefined : legacyStockAvailability,
    membershipStatus: loading ? "loading" : membershipStatus,
    channelNames,
    zones,
    warehouseChannelIds,
    zonesTruncated,
  });

  if (guidance.kind === "hidden") {
    return null;
  }

  const hiddenCount = Math.max(count - zones.length, 0);
  const zoneRequired = guidance.kind === "legacy-need-zone";
  // Zones are offered by shared channel, so without channels the assign dialog would be empty.
  const canAssign =
    canManage &&
    warehouseChannelIds.length > 0 &&
    guidance.kind !== "loading" &&
    guidance.kind !== "legacy-need-channel" &&
    guidance.kind !== "legacy-unknown";
  // Always mark outside-channel links, including when they are the only zones
  // (legacy-need-zone) so the list explains why they do not count for selling.
  const outside = new Set(
    zones
      .filter(zone => !zone.channelIds.some(channelId => warehouseChannelIds.includes(channelId)))
      .map(zone => zone.id),
  );

  return (
    <AssignListCard
      data-test-id="warehouse-shipping-zones"
      title={<FormattedMessage {...messages.zonesTitle} />}
      subtitle={
        guidance.kind === "loading" ? null : zoneRequired ? (
          <FormattedMessage {...messages.channelsRequired} />
        ) : count > 0 ? (
          <FormattedMessage {...messages.channelsAssignedCount} values={{ count }} />
        ) : null
      }
      emphasis={zoneRequired ? "warning" : "default"}
      loading={guidance.kind === "loading"}
      disabled={disabled}
      removable={canManage}
      intro={
        <>
          {zoneIntro(intl, guidance.kind, channelNames, pickupEnabled && zones.length === 0)}
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
