import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type Condition } from "@dashboard/discounts/models";
import { Box, Button } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";

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
      __gridTemplateColumns="160px 88px 1fr auto"
      alignItems="start"
      data-test-id="rule-condition-row"
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

      <Box display="flex" alignItems="flex-start" paddingTop={1}>
        <Button
          data-test-id={`condition-remove-${conditionIndex}`}
          variant="tertiary"
          size="small"
          icon={<X size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          onClick={onRemove}
        />
      </Box>
    </Box>
  );
};
