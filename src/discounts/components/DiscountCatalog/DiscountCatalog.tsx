import { DashboardCard } from "@dashboard/components/Card";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton";
import { CatalogRules } from "./componenets/CatalogRules";
import { messages } from "./messages";
import { Rule as RuleType } from "./types";

interface DiscountCatalogProps {
  rules: RuleType[];
  onRuleAdd: () => void;
}

export const DiscountCatalog = ({ onRuleAdd, rules }: DiscountCatalogProps) => {
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
        <CatalogRules rules={rules} />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
