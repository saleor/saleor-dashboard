import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import { Rule } from "@dashboard/discounts/models";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { RuleChannelChips } from "./components/RuleChannelChips";
import { RuleConditionsChips } from "./components/RuleConditionsChips";
import { RuleValueChips } from "./components/RuleValueChips";
import { hasNoRuleConditions } from "./utils";

interface RuleSummaryProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleSummary = ({ rule, currencySymbol }: RuleSummaryProps) => {
  if (!rule.channel || !rule.rewardValue) {
    return null;
  }

  if (hasNoRuleConditions(rule) || rule.hasPredicateNestedConditions) {
    return (
      <Text>
        <FormattedMessage
          {...messages.ruleSummaryWithoutConditions}
          values={{
            value: (
              <RuleValueChips rule={rule} currencySymbol={currencySymbol} />
            ),
            channel: <RuleChannelChips channel={rule.channel} />,
          }}
        />
      </Text>
    );
  }

  return (
    <Text>
      <FormattedMessage
        {...messages.ruleSummary}
        values={{
          value: <RuleValueChips rule={rule} currencySymbol={currencySymbol} />,
          conditions: (
            <RuleConditionsChips rule={rule} currencySymbol={currencySymbol} />
          ),
          channel: <RuleChannelChips channel={rule.channel} />,
        }}
      />
    </Text>
  );
};
