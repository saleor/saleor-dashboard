import { Rule } from "@dashboard/discounts/types";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import { Chip, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../../messages";

interface RuleSummaryProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleSummary = ({ rule, currencySymbol }: RuleSummaryProps) => {
  if (
    !rule.channels.length ||
    !rule.rewardValue ||
    rule.conditions.every(condition => !condition.values.length)
  ) {
    return null;
  }

  return (
    <Text>
      <FormattedMessage
        {...messages.ruleSummary}
        values={{
          value: getRuleValue(rule, currencySymbol),
          items: getItems(rule),
          channel: getChannels(rule.channels),
        }}
      />
    </Text>
  );
};

function getRuleValue(rule: Rule, currencySymbol: string) {
  const rewarddTypeValue =
    rule.rewardValueType === RewardValueTypeEnum.FIXED ? currencySymbol : "%";
  return (
    <Chip backgroundColor="surfaceBrandSubdued">
      {`${rule.rewardValue}${rewarddTypeValue}`}
    </Chip>
  );
}

function getChannels(channels: Rule["channels"]) {
  return channels.map(channel => (
    <Chip
      marginRight={1.5}
      backgroundColor="surfaceCriticalSubdued"
      key={channel.value}
    >
      {channel.label}
    </Chip>
  ));
}

function getItems(rule: Rule) {
  return rule.conditions.reduce<ReactNode[]>((acc, condition) => {
    const conditionValue = condition.values;
    acc.push(
      condition.values.slice(0, 2).map(({ label, value }) => (
        <Chip
          key={value}
          backgroundColor="surfaceBrandSubdued"
          marginRight={1.5}
        >
          {label}
        </Chip>
      )),
    );
    if (conditionValue.length > 3) {
      acc.push(
        <Chip backgroundColor="surfaceBrandSubdued" marginRight={1.5}>
          <FormattedMessage
            {...messages.ruleSummaryMoreItems}
            values={{
              itemsLength: conditionValue.length - 2,
              type: condition.type,
            }}
          />
          s
        </Chip>,
      );
    }

    return acc;
  }, []);
}
