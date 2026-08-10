import { ProductAvailabilityStatusLabel } from "@dashboard/components/ChannelsAvailabilityDropdown/ProductAvailabilityStatusLabel";
import { Pill } from "@dashboard/components/Pill";
import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { getPromotionStatus, getRelativePromotionTimeParts } from "@dashboard/discounts/utils";
import { type PromotionDetailsFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface DiscountDetailsTitleProps {
  data: PromotionDetailsFragment | undefined | null;
}

export const DiscountDetailsTitle = ({ data }: DiscountDetailsTitleProps): JSX.Element => {
  const intl = useIntl();

  if (!data) {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        paddingRight={3}
        __minWidth="0"
        data-test-id="discount-details-title-skeleton"
        aria-busy="true"
      >
        <Skeleton __width="9rem" __height="1.25rem" flexShrink="0" />
        <Skeleton __width="5.5rem" __height="1.375rem" borderRadius={3} flexShrink="0" />
        <Box display="flex" alignItems="center" gap={1} flexShrink="0">
          <Skeleton __width="0.5rem" __height="0.5rem" borderRadius="100%" />
          <Skeleton __width="4.5rem" __height="0.875rem" />
        </Box>
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
        ? {
            defaultMessage: "Ended",
            id: "DBuWYc",
            description: "voucher list status after end date",
          }
        : { defaultMessage: "Active", id: "3a5wL8" },
  );
  const statusDot: DotStatus =
    promotionStatus === "active"
      ? "success"
      : promotionStatus === "scheduled"
        ? "scheduled"
        : "neutral";
  const timeParts = getRelativePromotionTimeParts({
    status: promotionStatus,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  const timeHint = timeParts
    ? intl.formatRelativeTime(timeParts.value, timeParts.unit, { numeric: "auto", style: "long" })
    : null;

  return (
    <Box display="flex" alignItems="center" gap={2} paddingRight={3} __minWidth="0">
      <Box
        title={data.name}
        __maxWidth="320px"
        __overflow="hidden"
        __textOverflow="ellipsis"
        __whiteSpace="nowrap"
        __minWidth="0"
      >
        {data.name}
      </Box>
      <Pill data-test-id="promotion-type-info" label={typeLabel} color="neutral" />
      <Box data-test-id="promotion-status-info" flexShrink="0">
        <ProductAvailabilityStatusLabel label={statusLabel} status={statusDot} ellipsis={false} />
      </Box>
      {timeHint && (
        <Text color="default2" fontSize={2} __whiteSpace="nowrap" flexShrink="0">
          {timeHint}
        </Text>
      )}
    </Box>
  );
};
