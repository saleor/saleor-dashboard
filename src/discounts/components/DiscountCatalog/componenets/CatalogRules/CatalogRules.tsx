import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { Rule as RuleType } from "../../types";
import { Placeholder } from "../Placeholder";
import { Rule } from "../Rule";

interface CatalogRulesProps {
  rules: RuleType[];
}

export const CatalogRules = ({ rules }: CatalogRulesProps) => {
  if (rules.length === 0) {
    return <Placeholder />;
  }
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {rules.map(rule => (
        <Rule key={rule.id} rule={rule} />
      ))}
    </Box>
  );
};
