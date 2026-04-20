import { Chip, useTheme } from "@saleor/macaw-ui-next";

import { conditionTypeToHue } from "../../utils";

interface RuleSummaryChipsProps {
  label: string;
}

export const RuleSummaryChips = ({ label }: RuleSummaryChipsProps) => {
  const { theme } = useTheme();
  const color = conditionTypeToHue(label, theme);

  return (
    <Chip
      __backgroundColor={color.base}
      __color={color.text}
      __borderColor={color.border}
      data-test-id="rule-summary-chip"
    >
      {label}
    </Chip>
  );
};
