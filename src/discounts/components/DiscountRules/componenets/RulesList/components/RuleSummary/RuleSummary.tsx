import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import { type Rule } from "@dashboard/discounts/models";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Tag } from "lucide-react";
import { useIntl } from "react-intl";

import { RuleConditionsChips } from "./components/RuleConditionsChips";
import { RuleUnknownChips } from "./components/RuleUnknownChips";
import { hasNoRuleConditions } from "./utils";

interface RuleSummaryProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleSummary = ({ rule, currencySymbol }: RuleSummaryProps) => {
  const intl = useIntl();

  if (!rule.channel) {
    return null;
  }

  const showConditions = !hasNoRuleConditions(rule) || rule.hasPredicateNestedConditions;

  if (!showConditions) {
    return null;
  }

  return (
    <Box data-test-id="rule-summary" display="flex" flexDirection="column" gap={3}>
      <Box
        __height="1px"
        __backgroundColor="var(--mu-colors-border-default1)"
        __marginLeft="calc(-1 * var(--mu-spacing-4))"
        __marginRight="calc(-1 * var(--mu-spacing-4))"
      />

      <Box display="flex" flexDirection="column" gap={2}>
        <Text size={2} color="default2" display="flex" alignItems="center" gap={1.5}>
          <Tag size={16} />
          {intl.formatMessage(messages.appliesTo)}
        </Text>

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={1.5}>
          {rule.hasPredicateNestedConditions ? (
            <RuleUnknownChips />
          ) : (
            <RuleConditionsChips rule={rule} currencySymbol={currencySymbol} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
