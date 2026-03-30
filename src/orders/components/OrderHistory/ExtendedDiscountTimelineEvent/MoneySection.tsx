import { DiscountValueTypeEnum, type MoneyFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  discount: {
    id: "yJynYK",
    defaultMessage: "discount",
    description: "discount value",
  },
  fixedAmount: {
    id: "Zhxu58",
    defaultMessage: "Fixed amount",
    description: "Fixed amount subtitle",
  },
  newDiscountSectionTitle: {
    id: "MTl5o6",
    defaultMessage: "New discount value",
    description: "new discount label",
  },
  oldDiscountSectionTitle: {
    id: "2Sx05f",
    defaultMessage: "Previous discount value",
    description: "Previous discount label",
  },
  onlyDiscountSectionTitle: {
    id: "ljwv+L",
    defaultMessage: "Discount value",
    description: "discount value label",
  },
});

export enum MoneySectionType {
  OLD = "old",
  NEW = "new",
  ONLY = "only",
}

interface MoneySectionProps {
  value?: number | null;
  calculationMode?: DiscountValueTypeEnum | null;
  moneyData?: MoneyFragment | null;
  sectionType?: MoneySectionType;
}

export const MoneySection = ({
  value,
  calculationMode,
  moneyData,
  sectionType = MoneySectionType.ONLY,
}: MoneySectionProps) => {
  const intl = useIntl();

  if (!value) {
    return null;
  }

  const getDiscountSubtitle = () => {
    if (calculationMode === DiscountValueTypeEnum.PERCENTAGE) {
      return `${value}% ${intl.formatMessage(messages.discount)}`;
    }

    return intl.formatMessage(messages.fixedAmount);
  };

  const sectionTitleMessages: Record<MoneySectionType, (typeof messages)[keyof typeof messages]> = {
    [MoneySectionType.OLD]: messages.oldDiscountSectionTitle,
    [MoneySectionType.NEW]: messages.newDiscountSectionTitle,
    [MoneySectionType.ONLY]: messages.onlyDiscountSectionTitle,
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Text size={2} color="default2">
        {intl.formatMessage(sectionTitleMessages[sectionType])}
      </Text>
      <Text size={3} fontWeight="medium">
        {moneyData ? `${moneyData.amount} ${moneyData.currency}` : "n/a"}
      </Text>
      <Text size={2} color="default2">
        {getDiscountSubtitle()}
      </Text>
    </Box>
  );
};
