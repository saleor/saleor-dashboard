import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface RuleLabelProps {
  ruleName: string | undefined;
}

export const RuleLabel = ({ ruleName }: RuleLabelProps) => {
  const intl = useIntl();

  return (
    <Text size={4} fontWeight="bold" data-test-id="rule-name" ellipsis>
      {ruleName || intl.formatMessage(messages.untitledRule)}
    </Text>
  );
};
