import { Pill } from "@dashboard/components/Pill";
import { getPromotionStatus } from "@dashboard/discounts/utils";
import { type PromotionDetailsFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { type PillStatusType } from "@dashboard/misc";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
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
  const promotionStatus = getPromotionStatus(data.startDate, data.endDate);
  const statusLabel = intl.formatMessage(
    promotionStatus === "scheduled"
      ? { defaultMessage: "Scheduled", id: "to13M2" }
      : promotionStatus === "finished"
        ? { defaultMessage: "Finished", id: "Qrw4A1" }
        : { defaultMessage: "Active", id: "3FfJ0R" },
  );
  const statusColor: PillStatusType = promotionStatus === "active" ? "success" : "neutral";

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
    </Box>
  );
};
