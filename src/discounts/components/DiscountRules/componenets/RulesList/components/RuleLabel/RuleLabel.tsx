import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import { PromotionTypeEnum } from "@dashboard/graphql";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

interface RuleLabelProps {
  ruleName: string | undefined;
}

export const RuleLabel = ({ ruleName }: RuleLabelProps) => {
  const intl = useIntl();
  const { discountType } = useDiscountRulesContext();
  const getRuleName = (name: string | undefined) => {
    if (name) {
      return `: ${name}`;
    }
    return "";
  };
  const ruleTypeLabel = useMemo(() => {
    if (discountType === PromotionTypeEnum.CATALOGUE) {
      return intl.formatMessage(messages.catalogRule);
    }

    return intl.formatMessage(messages.orderRule);
  }, [discountType]);

  return <span data-test-id="rule-name">{ruleTypeLabel + getRuleName(ruleName)}</span>;
};
