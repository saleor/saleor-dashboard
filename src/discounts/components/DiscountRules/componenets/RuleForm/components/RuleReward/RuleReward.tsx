import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { RuleRewardPrice } from "../RuleRewardPrice";
import { RuleRewardSelect } from "../RuleRewardSelect/RuleRewardSelect";
interface RuleRewardProps {
  currencySymbol: string | null;
  error: string | undefined;
}

export const RuleReward = ({ currencySymbol, error }: RuleRewardProps) => {
  const intl = useIntl();
  const { discountType } = useDiscountRulesContext();

  return (
    <>
      <Text as="p">{intl.formatMessage(messages.reward)}</Text>
      {discountType === PromotionTypeEnum.CATALOGUE ? (
        <Box __width={350}>
          <RuleRewardPrice currencySymbol={currencySymbol} error={error} />
        </Box>
      ) : (
        <RuleRewardSelect currencySymbol={currencySymbol} error={error} />
      )}
    </>
  );
};
