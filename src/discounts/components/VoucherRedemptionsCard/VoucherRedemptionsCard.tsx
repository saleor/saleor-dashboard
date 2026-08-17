import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import {
  getVoucherSchedulePhase,
  type VoucherScheduleDateData,
} from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import useDateLocalize, { type LocalizeDate } from "@dashboard/hooks/useDateLocalize";
import { joinDateTime } from "@dashboard/misc";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";
import { FormattedMessage, type IntlShape, useIntl } from "react-intl";

import { getVoucherRedemptionsProgress } from "./getVoucherRedemptionsProgress";
import { voucherRedemptionsMessages as messages } from "./messages";
import styles from "./VoucherRedemptionsCard.module.css";

interface VoucherRedemptionsCardProps {
  used: number;
  hasUsageLimit: boolean;
  usageLimit: number;
  codesCount: number | null | undefined;
  channelsCount: number;
  scheduleData: VoucherScheduleDateData;
  loading?: boolean;
}

const formatScheduleStatus = ({
  scheduleData,
  localizeDate,
  intl,
}: {
  scheduleData: VoucherScheduleDateData;
  localizeDate: LocalizeDate;
  intl: IntlShape;
}): string => {
  const phase = getVoucherSchedulePhase(scheduleData);
  const startIso = joinDateTime(scheduleData.startDate, scheduleData.startTime);
  const endIso = scheduleData.hasEndDate
    ? joinDateTime(scheduleData.endDate, scheduleData.endTime)
    : null;

  if (phase === "scheduled") {
    return intl.formatMessage(messages.redeemableFrom, {
      date: startIso ? localizeDate(startIso, "ll") : "—",
    });
  }

  if (phase === "ended") {
    return intl.formatMessage(messages.redemptionEnded, {
      date: endIso ? localizeDate(endIso, "ll") : "—",
    });
  }

  if (endIso) {
    return intl.formatMessage(messages.redeemableNowUntil, {
      date: localizeDate(endIso, "ll"),
    });
  }

  return intl.formatMessage(messages.redeemableNow);
};

export const VoucherRedemptionsCard = ({
  used,
  hasUsageLimit,
  usageLimit,
  codesCount,
  channelsCount,
  scheduleData,
  loading = false,
}: VoucherRedemptionsCardProps): JSX.Element | null => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  // Monitoring job only exists with a total cap. Keep the loading shell so the
  // sidebar doesn’t jump when data resolves.
  if (!loading && !hasUsageLimit) {
    return null;
  }

  const resolvedCodesCount = codesCount ?? 0;
  const progress = getVoucherRedemptionsProgress({ used, usageLimit });
  const scheduleStatus = formatScheduleStatus({ scheduleData, localizeDate, intl });

  return (
    <Box className={styles.card} data-test-id="voucher-redemptions-card">
      <Box className={styles.body}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box className={styles.header}>
            <Text size={2} color="default2">
              <FormattedMessage {...messages.title} />
            </Text>
            <Box className={styles.meta}>
              {loading ? (
                <>
                  <Skeleton __width="3.5rem" __height="0.875rem" />
                  <Skeleton __width="4rem" __height="0.875rem" />
                </>
              ) : (
                <>
                  <Text size={2} color="default2">
                    <FormattedMessage
                      {...messages.codesCount}
                      values={{ count: resolvedCodesCount }}
                    />
                  </Text>
                  <Text size={2} color="default2">
                    <FormattedMessage
                      {...messages.channelsCount}
                      values={{ count: channelsCount }}
                    />
                  </Text>
                </>
              )}
            </Box>
          </Box>

          {loading ? (
            <Skeleton __width="5rem" __height="2.75rem" />
          ) : (
            <Text as="p" className={styles.metricValue} data-test-id="voucher-redemptions-used">
              {used}
            </Text>
          )}
        </Box>

        <Box>
          {loading ? (
            <Box display="flex" flexDirection="column" gap={2} aria-busy="true">
              <Skeleton __width="9rem" __height="0.875rem" />
              <Skeleton __width="11rem" __height="0.875rem" />
            </Box>
          ) : (
            <>
              <Box
                className={styles.meterTrack}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress.percentage}
                data-test-id="voucher-redemptions-meter"
              >
                <Box className={styles.meterFill} __width={`${progress.percentage}%`} aria-hidden />
              </Box>

              <Box className={styles.details} marginTop={2}>
                <Text size={2} color="default2" display="block">
                  <FormattedMessage
                    {...messages.usedOfLimit}
                    values={{ used: progress.used, limit: progress.limit }}
                  />
                </Text>
                <Text size={2} color="default2" display="block">
                  {progress.isExhausted ? (
                    <FormattedMessage {...messages.remainingNone} />
                  ) : (
                    <FormattedMessage
                      {...messages.remaining}
                      values={{ count: progress.remaining }}
                    />
                  )}
                </Text>
              </Box>

              <Text
                size={2}
                color="default2"
                display="block"
                className={styles.status}
                data-test-id="voucher-redemptions-schedule"
              >
                {scheduleStatus}
              </Text>
            </>
          )}
        </Box>

        <Box className={styles.info}>
          <Info
            className={styles.infoIcon}
            size={iconSize.small}
            strokeWidth={iconStrokeWidthBySize.small}
            aria-hidden
          />
          <Text as="p" size={2} color="default2" className={styles.infoText}>
            <FormattedMessage
              {...messages.countingHint}
              values={{
                settingName: (
                  <Text as="span" size={2} fontWeight="medium" color="default1">
                    <FormattedMessage {...messages.draftOrdersSettingName} />
                  </Text>
                ),
              }}
            />
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

VoucherRedemptionsCard.displayName = "VoucherRedemptionsCard";
