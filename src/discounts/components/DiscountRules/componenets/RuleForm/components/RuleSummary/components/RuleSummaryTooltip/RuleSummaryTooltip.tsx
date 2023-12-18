import { Box, Chip, DefaultTheme, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../../../../messages";
import { OptionWithConditionType } from "../../utils";
import { RuleSummaryChips } from "../RuleSummaryChips";

interface RuleSummaryTooltipProps {
  theme: DefaultTheme;
  conditionsValues: OptionWithConditionType[];
}

export const RuleSummaryTooltip = ({
  conditionsValues,
  theme,
}: RuleSummaryTooltipProps) => {
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
          {conditionsValues.map(({ value, label, type }) => (
            <RuleSummaryChips
              key={value}
              type={type}
              theme={theme}
              label={label}
            />
          ))}
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
