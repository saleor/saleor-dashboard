import { Rule } from "@dashboard/discounts/models";
import { ChannelFragment } from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { getCurencySymbol } from "../../utils";
import { Placeholder } from "../Placeholder";
import { RuleActions } from "./components/RuleActions/RuleActions";
import { RuleLabel } from "./components/RuleLabel";
import { RuleListContainer } from "./components/RuleListContainer";
import { RuleListLoading } from "./components/RuleListLoading";
import { RuleSummary } from "./components/RuleSummary";
import { RuleWrapper } from "./components/RuleWrapper";

interface RulesListProps<ErrorCode> {
  rules: Rule[];
  disabled?: boolean;
  channels: ChannelFragment[];
  errors: Array<CommonError<ErrorCode> & { index?: number }>;
  loading?: boolean;
  onRuleDelete: (index: number) => void;
  onRuleEdit: (index: number) => void;
}

export const RulesList = <ErrorCode,>({
  rules,
  errors,
  onRuleEdit,
  onRuleDelete,
  channels,
  disabled,
  loading,
}: RulesListProps<ErrorCode>) => {
  const intl = useIntl();

  if (loading) {
    return <RuleListLoading />;
  }

  if (rules.length === 0) {
    return <Placeholder />;
  }

  return (
    <RuleListContainer>
      {rules.map((rule, index) => {
        const hasError = errors.some(error => error.index === index);

        return (
          <RuleWrapper key={rule.id || index} hasError={hasError}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <RuleLabel ruleName={rule.name} />

                <RuleActions
                  onDelete={() => onRuleDelete(index)}
                  onEdit={() => onRuleEdit(index)}
                  disabled={disabled}
                />
              </Box>
              <RuleSummary
                rule={rule}
                currencySymbol={getCurencySymbol(rule.channel, channels)}
              />
              {hasError && (
                <Text color="critical1">
                  {intl.formatMessage(messages.ruleError)}
                </Text>
              )}
            </Box>
          </RuleWrapper>
        );
      })}
    </RuleListContainer>
  );
};
