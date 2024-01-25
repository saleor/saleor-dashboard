import { Combobox } from "@dashboard/components/Combobox";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { Condition, Rule } from "@dashboard/discounts/models";
import { Box, Button, RemoveIcon, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { RuleCondtionRightOperators } from "../RuleCondtionRightOperators";
import { RuleInputWrapper } from "../RuleInputWrapper/RuleInputWrapper";
import { getConditionNameValue } from "./utils";

interface DiscountConditionRowProps {
  disabled?: boolean;
  conditionIndex: number;
  onRemove: () => void;
  updateCondition: (index: number, value: Condition) => void;
  isConditionTypeSelected: (conditionType: string) => boolean;
}

export const RuleConditionRow = ({
  conditionIndex,
  onRemove,
  isConditionTypeSelected,
  updateCondition,
  disabled = false,
}: DiscountConditionRowProps) => {
  const ruleConditionNameFieldName = `conditions.${conditionIndex}.id` as const;
  const { field: nameField } = useController<
    Rule,
    typeof ruleConditionNameFieldName
  >({
    name: ruleConditionNameFieldName,
  });

  const ruleCondtionTypeFileName = `conditions.${conditionIndex}.type` as const;
  const { field: typeField } = useController<
    Rule,
    typeof ruleCondtionTypeFileName
  >({
    name: ruleCondtionTypeFileName,
  });

  const { watch } = useFormContext<Rule>();
  const condition = watch(`conditions.${conditionIndex}`);

  const { conditionNameOptions, getConditionTypesOptions } =
    useDiscountRulesContext();

  const conditionTypesOptions = getConditionTypesOptions(condition.id ?? "");

  const filteredConditionLeftOptions = conditionNameOptions.filter(
    condition => !isConditionTypeSelected(condition.value),
  );

  return (
    <Box
      display="grid"
      gap={0.5}
      __gridTemplateColumns="2fr 1fr 3fr 35px"
      placeItems="center"
      alignItems="start"
    >
      <RuleInputWrapper>
        <Combobox
          value={getConditionNameValue(nameField.value, conditionNameOptions)}
          fetchOptions={() => {}}
          options={filteredConditionLeftOptions}
          onChange={e => {
            condition.values = [];
            updateCondition(conditionIndex, condition);
            nameField.onChange(e.target.value);
          }}
          size="medium"
          data-test-id="rule-type"
          onBlur={nameField.onBlur}
          disabled={disabled}
        />
      </RuleInputWrapper>

      <RuleInputWrapper>
        <Select
          value={typeField.value}
          size="medium"
          options={conditionTypesOptions}
          onChange={typeField.onChange}
          disabled={disabled}
        />
      </RuleInputWrapper>

      <RuleInputWrapper>
        <RuleCondtionRightOperators
          conditionIndex={conditionIndex}
          disabled={disabled}
        />
      </RuleInputWrapper>

      <Button variant="tertiary" icon={<RemoveIcon />} onClick={onRemove} />
    </Box>
  );
};
