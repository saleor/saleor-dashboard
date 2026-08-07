import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { ChannelAvailabilityCard } from "@dashboard/components/ChannelAvailability/ChannelAvailabilityCard";
import {
  type ChannelAvailabilityStatus,
  type ChannelAvailabilitySummary,
} from "@dashboard/components/ChannelAvailability/types";
import { type PermissionEnum } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { joinDateTime } from "@dashboard/misc";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { getVoucherSchedulePhase, type VoucherScheduleDateData } from "./getVoucherSchedulePhase";
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
}: VoucherChannelAvailabilityCardProps): JSX.Element => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const sortedChannels = useMemo(
    () => [...channels].sort((a, b) => a.name.localeCompare(b.name)),
    [channels],
  );
  const channelSummaries = sortedChannels.map(toChannelSummary);
  const schedulePhase = getVoucherSchedulePhase(scheduleData);
  const startIso = joinDateTime(scheduleData.startDate, scheduleData.startTime);
  const endIso = scheduleData.hasEndDate
    ? joinDateTime(scheduleData.endDate, scheduleData.endTime)
    : null;

  const getChannelStatus = (_channel: ChannelAvailabilitySummary): ChannelAvailabilityStatus => {
    if (schedulePhase === "scheduled") {
      return {
        type: "scheduled",
        label: intl.formatMessage(messages.statusScheduled),
        description: intl.formatMessage(messages.statusScheduledDescription, {
          date: startIso ? localizeDate(startIso, "lll") : "—",
        }),
      };
    }

    if (schedulePhase === "ended") {
      return {
        type: "hidden",
        label: intl.formatMessage(messages.statusEnded),
        description: intl.formatMessage(messages.statusEndedDescription, {
          date: endIso ? localizeDate(endIso, "lll") : "—",
        }),
      };
    }

    return {
      type: "success",
      label: intl.formatMessage(messages.statusActive),
      description: intl.formatMessage(messages.statusActiveDescription),
    };
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
