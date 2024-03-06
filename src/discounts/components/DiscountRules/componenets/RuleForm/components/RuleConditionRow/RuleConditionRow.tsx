import { Condition } from "@dashboard/discounts/models";
import { Box, Button, RemoveIcon } from "@saleor/macaw-ui-next";
import React from "react";

import { RuleConditionName } from "../RuleConditionName/";
import { RuleConditionType } from "../RuleConditionType/";
import { RuleConditionValues } from "../RuleConditionValues";
import { RuleInputWrapper } from "../RuleInputWrapper";

interface DiscountConditionRowProps {
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
}: DiscountConditionRowProps) => {
  return (
    <Box
      display="grid"
      gap={2}
      __gridTemplateColumns="200px 106px 1fr 35px"
      placeItems="center"
      alignItems="start"
    >
      <RuleInputWrapper data-test-id="rule-condition-predicate-dropdown">
        <RuleConditionName
          conditionIndex={conditionIndex}
          updateCondition={updateCondition}
          isConditionTypeSelected={isConditionTypeSelected}
        />
      </RuleInputWrapper>

      <RuleInputWrapper data-test-id="rule-condition-type-dropdown">
        <RuleConditionType conditionIndex={conditionIndex} />
      </RuleInputWrapper>

      <RuleInputWrapper data-test-id="rule-condition-value-dropdown">
        <RuleConditionValues conditionIndex={conditionIndex} />
      </RuleInputWrapper>

      <Button
        data-test-id={`condition-remove-${conditionIndex}`}
        variant="tertiary"
        icon={<RemoveIcon />}
        onClick={onRemove}
      />
    </Box>
  );
};
