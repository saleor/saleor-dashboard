import { ConditionType } from "@dashboard/discounts/types";
import { Chip, DefaultTheme } from "@saleor/macaw-ui-next";
import React from "react";

import { conditionTypeToHue } from "../../utils";

export const RuleSummaryChips = ({
  type,
  theme,
  label,
}: {
  type: ConditionType;
  label: string;
  theme: DefaultTheme;
}) => {
  const color = conditionTypeToHue(type, theme);
  return (
    <Chip
      __backgroundColor={color.base}
      __color={color.text}
      __borderColor={color.border}
      marginRight={1.5}
    >
      {type.slice(0, 1).toLocaleUpperCase() + type.slice(1)}: {label}
    </Chip>
  );
};
