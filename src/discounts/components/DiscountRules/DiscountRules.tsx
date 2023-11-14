import { DashboardCard } from "@dashboard/components/Card";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { useIntl } from "react-intl";

import { initialRuleValues } from "../DiscountCreatePage/const";
import { Inputs } from "../DiscountCreatePage/types";
import { AddButton } from "./componenets/AddButton";
import { RulesList } from "./componenets/RulesList";
import { messages } from "./messages";

export const DiscountRules = () => {
  const intl = useIntl();
  const { append, fields: rules } = useFieldArray<Inputs, "rules">({
    name: "rules",
  });

  return (
    <DashboardCard marginBottom={20}>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(messages.title)}
          <AddButton
            onCatalogClick={() =>
              append({
                ...initialRuleValues,
              })
            }
          />
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>
        <RulesList rules={rules} />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
