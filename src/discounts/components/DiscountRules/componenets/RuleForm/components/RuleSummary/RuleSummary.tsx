import { Rule } from "@dashboard/discounts/models";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import {
  Box,
  Chip,
  DefaultTheme,
  Skeleton,
  Text,
  useTheme,
} from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../../messages";
import { RuleSummaryChips } from "./components/RuleSummaryChips";
import { RuleSummaryTooltip } from "./components/RuleSummaryTooltip/RuleSummaryTooltip";
import { mapConditionToOption, splitConditions } from "./utils";

interface RuleSummaryProps {
  rule: Rule;
  currencySymbol: string;
  loading?: boolean;
}

export const RuleSummary = ({
  rule,
  currencySymbol,
  loading,
}: RuleSummaryProps) => {
  const { theme } = useTheme();

  if (
    !rule.channel ||
    !rule.rewardValue ||
    rule.conditions.every(condition => !condition.values.length)
  ) {
    return null;
  }

  if (loading) {
    return (
      <Box paddingY={3}>
        <Skeleton />
      </Box>
    );
  }

  return (
    <Text>
      <FormattedMessage
        {...messages.ruleSummary}
        values={{
          value: getRuleValue(rule, currencySymbol),
          items: getItems(rule, theme),
          channel: getChannel(rule.channel),
        }}
      />
    </Text>
  );
};

function getRuleValue(rule: Rule, currencySymbol: string) {
  const rewarddTypeValue =
    rule.rewardValueType === RewardValueTypeEnum.FIXED ? currencySymbol : "%";
  return (
    <Chip
      backgroundColor="accent1Pressed"
      borderColor="accent1"
      color="default1"
    >
      {`${rule.rewardValue}${rewarddTypeValue}`}
    </Chip>
  );
}

function getChannel(channel: NonNullable<Rule["channel"]>) {
  return (
    <Chip
      marginRight={1.5}
      backgroundColor="accent1Pressed"
      borderColor="accent1"
      color="default1"
      key={channel.value}
    >
      {channel.label}
    </Chip>
  );
}

function getItems(rule: Rule, theme: DefaultTheme) {
  const conditions = mapConditionToOption(rule.conditions);
  const { conditionsInSummary, conditionsInTooltip } =
    splitConditions(conditions);

  const hasConditionInTooltip = conditionsInTooltip.length > 0;
  const conditionValues = conditionsInSummary.map(({ value, label, type }) => (
    <RuleSummaryChips key={value} type={type} theme={theme} label={label} />
  ));

  const restSummaryRender = hasConditionInTooltip ? (
    <RuleSummaryTooltip conditionsValues={conditionsInTooltip} theme={theme} />
  ) : null;

  return [...conditionValues, restSummaryRender];
}
