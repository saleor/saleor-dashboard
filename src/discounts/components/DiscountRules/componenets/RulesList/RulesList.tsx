import { Rule as RuleType } from "@dashboard/discounts/types";
import { ChannelFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { Placeholder } from "../Placeholder";
import { Rule } from "../Rule";

interface RulesListProps {
  rules: Array<RuleType & { id: string }>;
  channels: ChannelFragment[];
  onRuleSubmit?: (index: number) => void;
}

export const RulesList = ({
  rules,
  channels,
  onRuleSubmit,
}: RulesListProps) => {
  if (rules.length === 0) {
    return <Placeholder />;
  }
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {rules.map((rule, index) => (
        <Rule
          key={rule.id}
          index={index}
          channels={channels}
          onSubmit={onRuleSubmit}
        />
      ))}
    </Box>
  );
};
