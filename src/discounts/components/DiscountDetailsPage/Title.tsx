import { Pill } from "@dashboard/components/Pill";
import { type PromotionDetailsFragment, PromotionTypeEnum } from "@dashboard/graphql";
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

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {data.name}
      <Pill
        label={typeLabel}
        color={data.type === PromotionTypeEnum.CATALOGUE ? "info" : "attention"}
      />
    </Box>
  );
};
