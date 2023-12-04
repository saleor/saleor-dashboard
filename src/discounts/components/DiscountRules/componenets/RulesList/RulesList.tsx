import { Rule as RuleType } from "@dashboard/discounts/types";
import { ChannelFragment } from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import {
  Box,
  Button,
  EditIcon,
  Text,
  TrashBinIcon,
} from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { getCurencySymbol } from "../../utils";
import { Placeholder } from "../Placeholder";
import { RuleSummary } from "../Rule/components/RuleSummary";
import { RuleWrapper } from "../Rule/components/RuleWrapper";

interface RulesListProps<ErrorCode> {
  rules: RuleType[];
  disabled?: boolean;
  channels: ChannelFragment[];
  errors: Array<CommonError<ErrorCode> & { index?: number }>;
  onRuleDelete: (id: string) => void;
  onRulEdit: (id: string) => void;
}

export const RulesList = <ErrorCode,>({
  rules,
  errors,
  onRulEdit,
  onRuleDelete,
  channels,
  disabled,
}: RulesListProps<ErrorCode>) => {
  const intl = useIntl();
  if (rules.length === 0) {
    return <Placeholder />;
  }

  const getRuleName = (name: string | undefined) => {
    if (name) {
      return `: ${name}`;
    }
    return "";
  };

  return (
    <Box
      display="grid"
      __gridTemplateColumns="repeat(auto-fill, minmax(600px, 1fr))"
      gap={6}
    >
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
                {intl.formatMessage(messages.catalogRule) +
                  getRuleName(rule.name)}

                <Box display="flex">
                  <Button
                    size="small"
                    variant="tertiary"
                    onClick={() => onRulEdit(index.toString())}
                    cursor={disabled ? "not-allowed" : "pointer"}
                    disabled={disabled}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    size="small"
                    disabled={disabled}
                    variant="tertiary"
                    onClick={e => {
                      e.stopPropagation();
                      onRuleDelete(index.toString());
                    }}
                  >
                    <TrashBinIcon />
                  </Button>
                </Box>
              </Box>
              <RuleSummary
                rule={rule}
                currencySymbol={getCurencySymbol(rule.channels, channels)}
              />
              {hasError && (
                <Text color="textCriticalDefault">
                  {intl.formatMessage(messages.ruleError)}
                </Text>
              )}
            </Box>
          </RuleWrapper>
        );
      })}
    </Box>
  );
};
