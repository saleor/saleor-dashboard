import { Rule as RuleType } from "@dashboard/discounts/types";
import { ChannelFragment } from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import { Box, Text } from "@saleor/macaw-ui-next";
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
  onClick?: (id: string) => void;
}

export const RulesList = <ErrorCode,>({
  rules,
  errors,
  onClick,
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
      __gridTemplateColumns="repeat(auto-fill, minmax(800px, 1fr))"
      gap={6}
    >
      {rules.map((rule, index) => {
        const hasError = errors.some(error => error.index === index);

        return (
          <RuleWrapper
            key={rule.id || index}
            disabled={disabled}
            onClick={() => onClick(index.toString())}
            hasError={hasError}
          >
            <Box display="flex" flexDirection="column" gap={1}>
              {intl.formatMessage(messages.catalogRule) +
                getRuleName(rule.name)}
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
