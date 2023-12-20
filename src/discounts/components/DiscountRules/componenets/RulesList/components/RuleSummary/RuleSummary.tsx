import { Rule } from "@dashboard/discounts/models";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../../messages";
import { RuleChannelChips } from "./components/RuleChannelChips/RuleChannelChips";
import { RuleChips } from "./components/RuleChips";
import { RuleValueChips } from "./components/RuleValueChips";

interface RuleSummaryProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleSummary = ({ rule, currencySymbol }: RuleSummaryProps) => {
  if (
    !rule.channel ||
    !rule.rewardValue ||
    rule.conditions.every(condition => !condition.values.length)
  ) {
    return null;
  }

  return (
    <Text>
      <FormattedMessage
        {...messages.ruleSummary}
        values={{
          value: <RuleValueChips rule={rule} currencySymbol={currencySymbol} />,
          items: <RuleChips rule={rule} />,
          channel: <RuleChannelChips channel={rule.channel} />,
        }}
      />
    </Text>
  );
};
