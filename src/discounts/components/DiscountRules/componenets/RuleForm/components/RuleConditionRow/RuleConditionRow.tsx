import { Condition } from "@dashboard/discounts/models";
import { Box, Button, RemoveIcon } from "@saleor/macaw-ui-next";
import React from "react";

import { RuleConditionName } from "../RuleConditionName/";
import { RuleConditionType } from "../RuleConditionType/";
import { RuleConditionValues } from "../RuleConditionValues";
import { RuleInputWrapper } from "../RuleInputWrapper";

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
}: DiscountConditionRowProps) => {
  return (
    <Box
      display="grid"
      gap={0.5}
      __gridTemplateColumns="2fr 1fr 3fr 35px"
      placeItems="center"
      alignItems="start"
    >
      <RuleInputWrapper>
        <RuleConditionName
          conditionIndex={conditionIndex}
          updateCondition={updateCondition}
          isConditionTypeSelected={isConditionTypeSelected}
        />
      </RuleInputWrapper>

      <RuleInputWrapper>
        <RuleConditionType conditionIndex={conditionIndex} />
      </RuleInputWrapper>

      <RuleInputWrapper>
        <RuleConditionValues conditionIndex={conditionIndex} />
      </RuleInputWrapper>

      <Button variant="tertiary" icon={<RemoveIcon />} onClick={onRemove} />
    </Box>
  );
};
