import { Rule as RuleType } from "@dashboard/discounts/types";
import { ChannelFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { getCurencySymbol } from "../../utils";
import { Placeholder } from "../Placeholder";
import { RuleAccordion } from "../Rule/components/RuleAccordion";
import { RuleSummary } from "../Rule/components/RuleSummary";

interface RulesListProps {
  rules: Array<RuleType & { id: string }>;
  channels: ChannelFragment[];
  onClick?: (id: string) => void;
}

export const RulesList = ({ rules, onClick, channels }: RulesListProps) => {
  const intl = useIntl();
  if (rules.length === 0) {
    return <Placeholder />;
  }

  const getRuleName = (name: string | undefined) => {
    if (name) {
      return `: ${name}`;
    }
    return "";
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {rules.map((rule, index) => (
        <RuleAccordion key={rule.id} onClick={() => onClick(rule.id)}>
          <Box display="flex" flexDirection="column" gap={1}>
            {intl.formatMessage(messages.catalogRule) + getRuleName(rule.name)}
            <RuleSummary
              ruleIndex={index}
              currencySymbol={getCurencySymbol(rule.channels, channels)}
            />
          </Box>
        </RuleAccordion>
      ))}
    </Box>
  );
};
