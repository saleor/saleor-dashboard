import { DashboardCard } from "@dashboard/components/Card";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton";
import { RulesList } from "./componenets/RulesList";
import { messages } from "./messages";
import { DiscountRule } from "./types";

interface DiscountRulesProps {
  rules: DiscountRule[];
  onRuleAdd: () => void;
}

export const DiscountRules = ({ onRuleAdd, rules }: DiscountRulesProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(messages.title)}
          <AddButton onCatalogClick={onRuleAdd} />
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>
        <RulesList rules={rules} />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
