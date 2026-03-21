import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../../../../messages";
import { type ConditionChipOption } from "../../utils";
import { RuleSummaryChips } from "../RuleSummaryChips";

interface RuleSummaryTooltipProps {
  conditionsValues: ConditionChipOption[];
}

export const RuleSummaryTooltip = ({ conditionsValues }: RuleSummaryTooltipProps) => {
  const labels = [...new Set(conditionsValues.map(c => c.label))];

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Text size={2} color="default2" cursor="pointer" textDecoration="none">
          <FormattedMessage
            {...messages.ruleSummaryMoreItems}
            values={{
              itemsLength: conditionsValues.length,
            }}
          />
        </Text>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Box __maxWidth={390} display="flex" flexWrap="wrap" gap={2}>
          {labels.map(label => (
            <RuleSummaryChips key={label} label={label} />
          ))}
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
