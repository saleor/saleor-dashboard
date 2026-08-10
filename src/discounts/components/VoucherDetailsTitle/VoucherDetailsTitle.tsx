import { ProductAvailabilityStatusLabel } from "@dashboard/components/ChannelsAvailabilityDropdown/ProductAvailabilityStatusLabel";
import { Pill } from "@dashboard/components/Pill";
import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { getPromotionStatus, getRelativePromotionTimeParts } from "@dashboard/discounts/utils";
import { type VoucherDetailsFragment } from "@dashboard/graphql";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { getVoucherTypePillLabel } from "./getVoucherTypePillLabel";
import { voucherDetailsTitleMessages as messages } from "./messages";

interface VoucherDetailsTitleProps {
  voucher: VoucherDetailsFragment | undefined | null;
  name?: string;
}

export const VoucherDetailsTitle = ({ voucher, name }: VoucherDetailsTitleProps) => {
  const intl = useIntl();

  if (!voucher) {
    // Name · type pill · schedule/status — three title meta slots (time hint optional).
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        paddingRight={3}
        __minWidth="0"
        data-test-id="voucher-details-title-skeleton"
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

  const displayName = name ?? voucher.name ?? "";
  const promotionStatus = getPromotionStatus({
    startDate: voucher.startDate,
    endDate: voucher.endDate,
  });
  const statusLabel = intl.formatMessage(
    promotionStatus === "scheduled"
      ? messages.statusScheduled
      : promotionStatus === "finished"
        ? messages.statusInactive
        : messages.statusActive,
  );
  const statusDot: DotStatus =
    promotionStatus === "active"
      ? "success"
      : promotionStatus === "scheduled"
        ? "scheduled"
        : "neutral";
  const typeLabel = getVoucherTypePillLabel(voucher, intl);
  const timeParts = getRelativePromotionTimeParts({
    status: promotionStatus,
    startDate: voucher.startDate,
    endDate: voucher.endDate,
  });
  const timeHint = timeParts
    ? intl.formatRelativeTime(timeParts.value, timeParts.unit, { numeric: "auto", style: "long" })
    : null;

  return (
    <Box display="flex" alignItems="center" gap={2} paddingRight={3} __minWidth="0">
      <Box
        title={displayName}
        __maxWidth="320px"
        __overflow="hidden"
        __textOverflow="ellipsis"
        __whiteSpace="nowrap"
        __minWidth="0"
      >
        {displayName}
      </Box>
      <Pill data-test-id="voucher-type-info" label={typeLabel} color="neutral" />
      <Box data-test-id="voucher-status-info" flexShrink="0">
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
