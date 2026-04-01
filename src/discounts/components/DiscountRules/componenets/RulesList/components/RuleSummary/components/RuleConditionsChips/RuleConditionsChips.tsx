import { type Rule } from "@dashboard/discounts/models";
import { Box, Chip, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { type ConditionChipOption, getConditionEntityUrl, mapConditionToOption } from "../../utils";
import { RuleSummaryChips } from "../RuleSummaryChips";
import styles from "./RuleConditionsChips.module.css";
import { useEnrichConditions } from "./useEnrichConditions";

const MAX_VISIBLE_PER_GROUP = 3;

interface RuleChipsProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleConditionsChips = ({ rule, currencySymbol }: RuleChipsProps) => {
  const enrichConditions = useEnrichConditions(rule.conditions, currencySymbol);
  const conditions = mapConditionToOption(enrichConditions);
  const grouped = groupByLabel(conditions);

  return (
    <>
      {Object.entries(grouped).map(([groupLabel, items]) => {
        const visible = items.slice(0, MAX_VISIBLE_PER_GROUP);
        const overflow = items.slice(MAX_VISIBLE_PER_GROUP);

        return (
          <React.Fragment key={groupLabel}>
            <RuleSummaryChips label={groupLabel} />
            {visible.map((item, index) => {
              const isLast = index === visible.length - 1;
              const showComma = !isLast || overflow.length > 0;

              return (
                <React.Fragment key={item.entityId ?? item.value}>
                  <ConditionItemLink item={item} />
                  {showComma && (
                    <Text size={2} color="default2" __marginLeft="-4px">
                      ,
                    </Text>
                  )}
                </React.Fragment>
              );
            })}
            {overflow.length > 0 && <OverflowIndicator items={overflow} />}
          </React.Fragment>
        );
      })}
    </>
  );
};

const ConditionItemLink = ({ item }: { item: ConditionChipOption }) => {
  const url = getConditionEntityUrl(item.conditionType, item.entityId);

  if (url) {
    return (
      <Link
        to={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.conditionLink}
        title={item.value}
        onClick={e => e.stopPropagation()}
      >
        <Text
          size={2}
          color="default1"
          className={`${styles.conditionText} ${styles.itemText}`}
          data-test-id="rule-condition-item-link"
        >
          {item.value}
        </Text>
      </Link>
    );
  }

  return (
    <Text size={2} color="default1" className={styles.itemText} title={item.value}>
      {item.value}
    </Text>
  );
};

const OverflowIndicator = ({ items }: { items: ConditionChipOption[] }) => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Chip
          backgroundColor="default1Hovered"
          borderColor="default1Hovered"
          color="default2"
          cursor="pointer"
          size="small"
        >
          <FormattedMessage
            defaultMessage="+{count} more"
            id="/zFGgP"
            values={{ count: items.length }}
          />
        </Chip>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Arrow />
        <Box display="flex" flexWrap="wrap" __maxWidth="460px">
          {items.map((item, index) => (
            <React.Fragment key={item.entityId ?? item.value}>
              <ConditionItemLink item={item} />
              {index < items.length - 1 && (
                <Text size={2} color="default2">
                  ,&nbsp;
                </Text>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};

const groupByLabel = (conditions: ConditionChipOption[]): Record<string, ConditionChipOption[]> => {
  return conditions.reduce<Record<string, ConditionChipOption[]>>((acc, condition) => {
    const key = condition.label;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(condition);

    return acc;
  }, {});
};
