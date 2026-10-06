import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Link } from "@dashboard/components/Link";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { shippingZonesListUrl, shippingZoneUrl } from "@dashboard/shipping/urls";
import { messages } from "@dashboard/warehouses/messages";
import {
  warehouseZonesGuidance,
  type ZoneChannelMembership,
} from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

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
}

const channelList = (names: string[]): string => {
  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names[0]} +${names.length - 1}`;
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
}: WarehouseShippingZonesCardProps): ReactNode => {
  const guidance = warehouseZonesGuidance({
    legacyStockAvailability: loading ? undefined : legacyStockAvailability,
    hasZones: zones.length > 0,
    membershipStatus: loading ? "loading" : membershipStatus,
    channelNames,
    zones,
    warehouseChannelIds,
  });

  if (guidance.kind === "loading") {
    return (
      <DetailSettingsCard title={<FormattedMessage {...messages.zonesTitle} />}>
        <Skeleton __height="1.25rem" __width="60%" />
      </DetailSettingsCard>
    );
  }

  if (guidance.kind === "hidden") {
    return null;
  }

  const hiddenCount = Math.max((totalCount ?? zones.length) - zones.length, 0);
  const outside = new Set(guidance.kind === "legacy-linked" ? guidance.outsideChannelZoneIds : []);

  return (
    <DetailSettingsCard
      title={<FormattedMessage {...messages.zonesTitle} />}
      data-test-id="warehouse-shipping-zones"
      intro={
        <Text size={3} color="default2">
          {guidance.kind === "direct" ? <FormattedMessage {...messages.zonesDirectIntro} /> : null}
          {guidance.kind === "legacy-need-channel" ? (
            <FormattedMessage {...messages.zonesNeedChannel} />
          ) : null}
          {guidance.kind === "legacy-unknown" ? (
            <FormattedMessage {...messages.zonesUnknown} />
          ) : null}
          {guidance.kind === "legacy-need-zone" ? (
            <FormattedMessage
              {...messages.zonesNeedZone}
              values={{
                channels: channelList(guidance.channelNames),
                zonesLink: chunks => (
                  <MicrocopyLink to={shippingZonesListUrl()}>{chunks}</MicrocopyLink>
                ),
              }}
            />
          ) : null}
          {guidance.kind === "legacy-linked" ? (
            <FormattedMessage {...messages.zonesLegacyIntro} />
          ) : null}
        </Text>
      }
    >
      {guidance.kind === "legacy-need-zone" && pickupEnabled ? (
        <Text size={3} color="default2">
          <FormattedMessage {...messages.zonesPickupWithoutZone} />
        </Text>
      ) : null}
      {zones.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {zones.map(zone => (
            <Box key={zone.id} display="flex" flexDirection="column" gap={0.5}>
              <Link href={shippingZoneUrl(zone.id)}>{zone.name}</Link>
              {outside.has(zone.id) ? (
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.zonesOutsideChannel} />
                </Text>
              ) : null}
            </Box>
          ))}
          {hiddenCount > 0 ? (
            <MicrocopyLink to={shippingZonesListUrl()}>
              <FormattedMessage {...messages.zonesMore} values={{ count: hiddenCount }} />
            </MicrocopyLink>
          ) : null}
        </Box>
      ) : null}
    </DetailSettingsCard>
  );
};

WarehouseShippingZonesCard.displayName = "WarehouseShippingZonesCard";
