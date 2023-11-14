import { Rule as RuleType } from "@dashboard/discounts/components/DiscountCreatePage/types";
import { ChannelFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { Placeholder } from "../Placeholder";
import { Rule } from "../Rule";

interface RulesListProps {
  rules: Array<RuleType & { id: string }>;
  channels: ChannelFragment[];
}

export const RulesList = ({ rules, channels }: RulesListProps) => {
  if (rules.length === 0) {
    return <Placeholder />;
  }
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {rules.map((rule, index) => (
        <Rule key={rule.id} index={index} channels={channels} />
      ))}
    </Box>
  );
};
