import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { DiscountRule } from "../../types";
import { Placeholder } from "../Placeholder";
import { Rule } from "../Rule";

interface RulesListProps {
  rules: DiscountRule[];
}

export const RulesList = ({ rules }: RulesListProps) => {
  if (rules.length === 0) {
    return <Placeholder />;
  }
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {rules.map(rule => (
        <Rule
          key={rule.id}
          rule={rule}
          channels={[
            { label: "Chan 1", value: "1" },
            { label: "Chan 2", value: "2" },
          ]}
        />
      ))}
    </Box>
  );
};
