import { Pill } from "@dashboard/components/Pill";
import { getPromotionStatus, getRelativePromotionTimeParts } from "@dashboard/discounts/utils";
import { type PromotionDetailsFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { type PillStatusType } from "@dashboard/misc";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

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
  const promotionStatus = getPromotionStatus({ startDate: data.startDate, endDate: data.endDate });
  const statusLabel = intl.formatMessage(
    promotionStatus === "scheduled"
      ? { defaultMessage: "Scheduled", id: "cXAlMR" }
      : promotionStatus === "finished"
        ? { defaultMessage: "Finished", id: "EQpfkS" }
        : { defaultMessage: "Active", id: "3a5wL8" },
  );
  const statusColor: PillStatusType =
    promotionStatus === "active" ? "success" : promotionStatus === "scheduled" ? "info" : "neutral";
  const timeParts = getRelativePromotionTimeParts({
    status: promotionStatus,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  const timeHint = timeParts
    ? intl.formatRelativeTime(timeParts.value, timeParts.unit, { numeric: "auto", style: "long" })
    : null;

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
