import { DashboardCard } from "@dashboard/components/Card";
import { Rule } from "@dashboard/discounts/types";
import { ChannelFragment } from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton";
import { RulesList } from "./componenets/RulesList";
import { messages } from "./messages";

interface DiscountRulesProps<ErrorCode> {
  disabled?: boolean;
  channels: ChannelFragment[];
  rules: Rule[];
  errors: Array<CommonError<ErrorCode> & { index?: number }>;
  onRuleEdit: (id: string) => void;
  onRuleAdd: () => void;
  onRuleDelete: (id: string) => void;
}

export const DiscountRules = <ErrorCode,>({
  disabled,
  channels,
  rules,
  errors,
  onRuleEdit,
  onRuleAdd,
  onRuleDelete,
}: DiscountRulesProps<ErrorCode>) => {
  const intl = useIntl();

  return (
    <DashboardCard marginBottom={20}>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(messages.title)}
          <AddButton disabled={disabled} onCatalogClick={onRuleAdd} />
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>
        <RulesList
          rules={rules}
          onRulEdit={onRuleEdit}
          onRuleDelete={onRuleDelete}
          channels={channels}
          errors={errors}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
