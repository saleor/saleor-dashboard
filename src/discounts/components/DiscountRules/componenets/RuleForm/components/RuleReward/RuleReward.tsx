import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { PromotionTypeEnum, RewardTypeEnum } from "@dashboard/graphql";
import { Box, BoxProps, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { RuleRewardGifts } from "../RuleRewardGifts";
import { RuleRewardTypeSelect } from "../RuleRewardTypeSelect/RuleRewardTypeSelect";
import { RuleRewardValue } from "../RuleRewardValue";
interface RuleRewardProps {
  currencySymbol: string | null;
  error: string | undefined;
}

export const RuleReward = ({ currencySymbol, error }: RuleRewardProps) => {
  const { discountType } = useDiscountRulesContext();
  const { watch } = useFormContext<Rule>();
  const rewardType = watch("rewardType");

  if (discountType === PromotionTypeEnum.ORDER) {
    return (
      <RuleRewardWrapper display="grid" __gridTemplateColumns="1fr 2fr" gap={4}>
        <RuleRewardTypeSelect />;
        {rewardType === RewardTypeEnum.GIFT && <RuleRewardGifts />}
        {rewardType === RewardTypeEnum.SUBTOTAL_DISCOUNT && (
          <RuleRewardValue currencySymbol={currencySymbol} error={error} />
        )}
      </RuleRewardWrapper>
    );
  }

  return (
    <RuleRewardWrapper __width={350}>
      <RuleRewardValue currencySymbol={currencySymbol} error={error} />
    </RuleRewardWrapper>
  );
};

function RuleRewardWrapper({
  children,
  ...props
}: { children: React.ReactNode } & BoxProps) {
  const intl = useIntl();

  return (
    <Box {...props}>
      <Text as="p">{intl.formatMessage(messages.reward)}</Text>
      {children}
    </Box>
  );
}
