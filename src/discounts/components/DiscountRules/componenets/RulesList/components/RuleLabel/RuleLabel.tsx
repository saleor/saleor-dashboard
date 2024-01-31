import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import React from "react";
import { useIntl } from "react-intl";

interface RuleLabelProps {
  ruleName: string | undefined;
}

export const RuleLabel = ({ ruleName }: RuleLabelProps) => {
  const intl = useIntl();

  const getRuleName = (name: string | undefined) => {
    if (name) {
      return `: ${name}`;
    }
    return "";
  };

  // const ruleTypeLabel = useMemo(() => {
  //   if (discountType === PromotionTypeEnum.CATALOGUE) {
  //     return intl.formatMessage(messages.catalogRule);
  //   }

  //   return intl.formatMessage(messages.orderRule);
  // }, [discountType]);

  return (
    <>{intl.formatMessage(messages.catalogRule) + getRuleName(ruleName)}</>
  );
};
