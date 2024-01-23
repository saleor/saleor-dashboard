import { Chip, DefaultTheme } from "@saleor/macaw-ui-next";
import React from "react";

import { conditionTypeToHue } from "../../utils";

export const RuleSummaryChips = ({
  type,
  theme,
  label,
}: {
  type: string;
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
      {type}: {label}
    </Chip>
  );
};
