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
  /** Audience / usage constraints — chips render only when true. */
  onlyForStaff?: boolean;
  applyOncePerCustomer?: boolean;
  singleUse?: boolean;
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
  onlyForStaff = false,
  applyOncePerCustomer = false,
  singleUse = false,
  loading = false,
}: VoucherRedemptionsCardProps): JSX.Element => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const resolvedCodesCount = codesCount ?? 0;
  const progress = hasUsageLimit ? getVoucherRedemptionsProgress({ used, usageLimit }) : null;
  const scheduleStatus = formatScheduleStatus({ scheduleData, localizeDate, intl });
  const constraintChips = [
    onlyForStaff
      ? {
          id: "staff-only",
          label: intl.formatMessage(messages.constraintStaffOnly),
        }
      : null,
    applyOncePerCustomer
      ? {
          id: "once-per-customer",
          label: intl.formatMessage(messages.constraintOncePerCustomer),
        }
      : null,
    singleUse
      ? {
          id: "single-use",
          label: intl.formatMessage(messages.constraintSingleUse),
        }
      : null,
  ].filter((chip): chip is { id: string; label: string } => chip != null);

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
              {hasUsageLimit && progress ? (
                <Box
                  className={styles.meterTrack}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress.percentage}
                  data-test-id="voucher-redemptions-meter"
                >
                  <Box
                    className={styles.meterFill}
                    __width={`${progress.percentage}%`}
                    aria-hidden
                  />
                </Box>
              ) : null}

              <Box className={styles.details} marginTop={hasUsageLimit && progress ? 2 : 0}>
                <Text size={2} color="default2" display="block">
                  {hasUsageLimit && progress ? (
                    <FormattedMessage
                      {...messages.usedOfLimit}
                      values={{ used: progress.used, limit: progress.limit }}
                    />
                  ) : (
                    <FormattedMessage {...messages.usedUnlimited} values={{ used }} />
                  )}
                </Text>
                {hasUsageLimit && progress ? (
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
                ) : null}
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

        {!loading && constraintChips.length > 0 ? (
          <Box
            className={styles.constraints}
            data-test-id="voucher-redemptions-constraints"
            aria-label={intl.formatMessage(messages.constraintsLabel)}
          >
            {constraintChips.map(chip => (
              <span key={chip.id} className={styles.constraintChip} data-test-id={chip.id}>
                {chip.label}
              </span>
            ))}
          </Box>
        ) : null}

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
