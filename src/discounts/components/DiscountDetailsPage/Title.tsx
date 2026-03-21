import { Pill } from "@dashboard/components/Pill";
import { getPromotionStatus, type PromotionStatus } from "@dashboard/discounts/utils";
import { type PromotionDetailsFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { type PillStatusType } from "@dashboard/misc";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type IntlShape, useIntl } from "react-intl";

function getRelativeTimeHint(
  status: PromotionStatus,
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  intl: IntlShape,
): string | null {
  const referenceDate = status === "scheduled" ? startDate : status === "finished" ? endDate : null;

  if (!referenceDate) {
    return null;
  }

  const diffMs = new Date(referenceDate).getTime() - Date.now();
  const absDiffMs = Math.abs(diffMs);
  const MINUTE = 60_000;
  const HOUR = 3_600_000;
  const DAY = 86_400_000;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (absDiffMs < HOUR) {
    value = Math.round(diffMs / MINUTE);
    unit = "minute";
  } else if (absDiffMs < DAY) {
    value = Math.round(diffMs / HOUR);
    unit = "hour";
  } else {
    value = Math.round(diffMs / DAY);
    unit = "day";
  }

  return intl.formatRelativeTime(value, unit, { numeric: "auto", style: "long" });
}

interface DiscountDetailsTitleProps {
  data: PromotionDetailsFragment | undefined | null;
}

export const DiscountDetailsTitle = ({ data }: DiscountDetailsTitleProps) => {
  const intl = useIntl();

  if (!data) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <Skeleton __width="10em" />
      </Box>
    );
  }

  const typeLabel =
    data.type === PromotionTypeEnum.CATALOGUE
      ? intl.formatMessage({ defaultMessage: "Catalog", id: "GOdq5V" })
      : intl.formatMessage({ defaultMessage: "Order", id: "XPruqs" });
  const promotionStatus = getPromotionStatus(data.startDate, data.endDate);
  const statusLabel = intl.formatMessage(
    promotionStatus === "scheduled"
      ? { defaultMessage: "Scheduled", id: "to13M2" }
      : promotionStatus === "finished"
        ? { defaultMessage: "Finished", id: "Qrw4A1" }
        : { defaultMessage: "Active", id: "3FfJ0R" },
  );
  const statusColor: PillStatusType =
    promotionStatus === "active" ? "success" : promotionStatus === "scheduled" ? "info" : "neutral";
  const timeHint = getRelativeTimeHint(promotionStatus, data.startDate, data.endDate, intl);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        title={data.name}
        __maxWidth="320px"
        __overflow="hidden"
        __textOverflow="ellipsis"
        __whiteSpace="nowrap"
      >
        {data.name}
      </Box>
      <Pill data-test-id="promotion-type-info" label={typeLabel} color="neutral" />
      <Pill data-test-id="promotion-status-info" label={statusLabel} color={statusColor} />
      {timeHint && (
        <Text color="default2" fontSize={2} __whiteSpace="nowrap">
          {timeHint}
        </Text>
      )}
    </Box>
  );
};
