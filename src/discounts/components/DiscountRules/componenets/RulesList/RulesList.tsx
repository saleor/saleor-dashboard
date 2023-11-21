import { ConditionType, Rule as RuleType } from "@dashboard/discounts/types";
import { FetchOptions } from "@dashboard/discounts/views/DiscountCreate/hooks/useOptionsFetch";
import { ChannelFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { Placeholder } from "../Placeholder";
import { Rule } from "../Rule";

interface RulesListProps {
  rules: Array<RuleType & { id: string }>;
  channels: ChannelFragment[];
  onRuleSubmit?: (index: number) => void;
  fetchOptions: (type: ConditionType) => FetchOptions;
}

export const RulesList = ({
  rules,
  channels,
  onRuleSubmit,
  fetchOptions,
}: RulesListProps) => {
  if (rules.length === 0) {
    return <Placeholder />;
  }
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {rules.map((rule, index) => (
        <Rule
          fetchOptions={fetchOptions}
          key={rule.id}
          index={index}
          channels={channels}
          onSubmit={onRuleSubmit}
        />
      ))}
    </Box>
  );
};
