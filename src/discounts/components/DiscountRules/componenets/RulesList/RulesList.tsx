import { Rule as RuleType } from "@dashboard/discounts/components/DiscountCreatePage/types";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { Placeholder } from "../Placeholder";
import { Rule } from "../Rule";

interface RulesListProps {
  rules: Array<RuleType & { id: string }>;
}

export const RulesList = ({ rules }: RulesListProps) => {
  if (rules.length === 0) {
    return <Placeholder />;
  }
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {rules.map((rule, index) => (
        <Rule
          key={rule.id}
          id={rule.id}
          index={index}
          channels={[
            { label: "Chan 1", value: "1" },
            { label: "Chan 2", value: "2" },
          ]}
        />
      ))}
    </Box>
  );
};
