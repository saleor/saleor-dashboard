import { Rule as RuleType } from "@dashboard/discounts/types";
import {
  ChannelFragment,
  PromotionCreateErrorFragment,
} from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { Placeholder } from "../Placeholder";
import { Rule } from "../Rule";

interface RulesListProps {
  disabled?: boolean;
  rules: Array<RuleType & { id: string }>;
  channels: ChannelFragment[];
  errors: PromotionCreateErrorFragment[];
}

export const RulesList = ({
  rules,
  channels,
  disabled,
  errors,
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
          disabled={disabled}
          errors={errors?.filter(error => error.index === index) ?? []}
        />
      ))}
    </Box>
  );
};
