import { Box, Chip, Option, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../../../../messages";
import { RuleSummaryChips } from "../RuleSummaryChips";

interface RuleSummaryTooltipProps {
  conditionsValues: Option[];
}

export const RuleSummaryTooltip = ({ conditionsValues }: RuleSummaryTooltipProps) => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Chip
          backgroundColor="accent1Pressed"
          borderColor="accent1"
          color="default1"
          marginRight={1.5}
          cursor="pointer"
        >
          <FormattedMessage
            {...messages.ruleSummaryMoreItems}
            values={{
              itemsLength: conditionsValues.length,
            }}
          />
        </Chip>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Box __maxWidth={390} display="flex" flexWrap="wrap" gap={2}>
          {conditionsValues.map(({ value, label }) => (
            <RuleSummaryChips key={value} value={value} label={label} />
          ))}
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
