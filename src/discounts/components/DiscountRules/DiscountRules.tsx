import { DashboardCard } from "@dashboard/components/Card";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { ChannelFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { useIntl } from "react-intl";

import { initialRuleValues } from "../DiscountCreatePage/initialFormValues";
import { AddButton } from "./componenets/AddButton";
import { RulesList } from "./componenets/RulesList";
import { messages } from "./messages";

interface DiscountRulesProps {
  disabled?: boolean;
  channels: ChannelFragment[];
  onRuleEdit: (id: string) => void;
}

export const DiscountRules = ({
  disabled,
  onRuleEdit,
  channels,
}: DiscountRulesProps) => {
  const intl = useIntl();
  const { append, fields: rules } = useFieldArray<DiscoutFormData, "rules">({
    name: "rules",
  });

  return (
    <DashboardCard marginBottom={20}>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(messages.title)}
          <AddButton
            disabled={disabled}
            onCatalogClick={() =>
              append({
                ...initialRuleValues,
              })
            }
          />
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>
        <RulesList rules={rules} onClick={onRuleEdit} channels={channels} />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
