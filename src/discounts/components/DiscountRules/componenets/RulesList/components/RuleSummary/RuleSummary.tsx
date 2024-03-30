import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import { Rule } from "@dashboard/discounts/models";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { RuleChannelChips } from "./components/RuleChannelChips";
import { RuleConditionsChips } from "./components/RuleConditionsChips";
import { RuleUnknownChips } from "./components/RuleUnknownChips";
import { RuleValueChips } from "./components/RuleValueChips";
import { hasNoRuleConditions } from "./utils";

interface RuleSummaryProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleSummary = ({ rule, currencySymbol }: RuleSummaryProps) => {
  if (!rule.channel || (!rule.rewardValue && rule.rewardType === null)) {
    return null;
  }

  if (rule.hasPredicateNestedConditions) {
    return (
      <Text>
        <FormattedMessage
          {...messages.ruleSummaryWithComplexConditions}
          values={{
            value: (
              <RuleValueChips rule={rule} currencySymbol={currencySymbol} />
            ),
            unknown: <RuleUnknownChips />,
            channel: <RuleChannelChips channel={rule.channel} />,
          }}
        />
      </Text>
    );
  }

  if (hasNoRuleConditions(rule)) {
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
    <Text data-test-id="rule-summary">
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
