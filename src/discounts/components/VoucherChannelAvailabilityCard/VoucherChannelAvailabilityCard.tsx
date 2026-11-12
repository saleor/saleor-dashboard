import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { ChannelAvailabilityCard } from "@dashboard/components/ChannelAvailability/ChannelAvailabilityCard";
import {
  type ChannelAvailabilityStatus,
  type ChannelAvailabilitySummary,
} from "@dashboard/components/ChannelAvailability/types";
import { getVoucherFormStatus } from "@dashboard/discounts/voucherStatus";
import { voucherStatusMessages } from "@dashboard/discounts/voucherStatusMessages";
import { type PermissionEnum } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { joinDateTime } from "@dashboard/misc";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { type VoucherScheduleDateData } from "./getVoucherSchedulePhase";
import { voucherChannelAvailabilityMessages as messages } from "./messages";

interface VoucherChannelAvailabilityCardProps {
  channels: ChannelVoucherData[];
  totalChannelsCount: number;
  disabled?: boolean;
  loading?: boolean;
  managePermissions: PermissionEnum[];
  onManageClick: () => void;
  /** Used only to derive per-channel Active / Scheduled / Ended status. */
  scheduleData: VoucherScheduleDateData;
  /** Every use the usage limit allows is taken, so no channel can redeem the voucher. */
  usageLimitReached: boolean;
}

const toChannelSummary = (channel: ChannelVoucherData): ChannelAvailabilitySummary => ({
  id: channel.id,
  name: channel.name,
  currencyCode: channel.currency ?? "",
});

export const VoucherChannelAvailabilityCard = ({
  channels,
  totalChannelsCount,
  loading = false,
  managePermissions,
  onManageClick,
  scheduleData,
  usageLimitReached,
}: VoucherChannelAvailabilityCardProps): React.ReactNode => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const sortedChannels = useMemo(
    () => [...channels].sort((a, b) => a.name.localeCompare(b.name)),
    [channels],
  );
  const channelSummaries = sortedChannels.map(toChannelSummary);
  const status = getVoucherFormStatus({ scheduleData, usageLimitReached });
  const startIso = joinDateTime(scheduleData.startDate, scheduleData.startTime);
  const endIso = scheduleData.hasEndDate
    ? joinDateTime(scheduleData.endDate, scheduleData.endTime)
    : null;

  const getChannelStatus = (_channel: ChannelAvailabilitySummary): ChannelAvailabilityStatus => {
    switch (status) {
      case "scheduled":
        return {
          type: "scheduled",
          label: intl.formatMessage(messages.statusScheduled),
          description: intl.formatMessage(messages.statusScheduledDescription, {
            date: startIso ? localizeDate(startIso, "lll") : "—",
          }),
        };
      case "finished":
        return {
          type: "hidden",
          label: intl.formatMessage(messages.statusEnded),
          description: intl.formatMessage(messages.statusEndedDescription, {
            date: endIso ? localizeDate(endIso, "lll") : "—",
          }),
        };
      case "usedUp":
        return {
          type: "hidden",
          label: intl.formatMessage(voucherStatusMessages.usedUp),
          description: intl.formatMessage(messages.statusUsedUpDescription),
        };
      case "active":
        return {
          type: "success",
          label: intl.formatMessage(messages.statusActive),
          description: intl.formatMessage(messages.statusActiveDescription),
        };
    }
  };

  return (
    <ChannelAvailabilityCard
      entityType="voucher"
      variant="list"
      channels={channelSummaries}
      totalChannelsCount={totalChannelsCount}
      isLoading={loading}
      emptyDescription={intl.formatMessage(messages.emptyDescription)}
      onManageClick={onManageClick}
      managePermissions={managePermissions}
      getChannelStatus={getChannelStatus}
    />
  );
};

VoucherChannelAvailabilityCard.displayName = "VoucherChannelAvailabilityCard";
