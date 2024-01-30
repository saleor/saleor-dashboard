import { Chip, useTheme } from "@saleor/macaw-ui-next";
import React from "react";

import { conditionTypeToHue } from "../../utils";

export const RuleSummaryChips = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  const { theme } = useTheme();
  const color = conditionTypeToHue(label, theme);

  return (
    <Chip
      __backgroundColor={color.base}
      __color={color.text}
      __borderColor={color.border}
      marginRight={1.5}
    >
      {label}: {value}
    </Chip>
  );
};
