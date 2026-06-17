import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { useIntl } from "react-intl";

import { modelTypeTabsMessages } from "./messages";

export const ModelTypeTabGroupingHelp = () => {
  const intl = useIntl();

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          cursor="pointer"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          aria-label={intl.formatMessage(modelTypeTabsMessages.groupingHelpAriaLabel)}
          data-test-id="model-type-tabs-grouping-help"
        >
          <CircleHelp size={16} color="var(--mu-colors-text-default2)" />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" align="end">
        <Tooltip.Arrow />
        <Box display="flex" flexDirection="column" gap={2} __maxWidth="300px">
          <Text size={2} fontWeight="bold">
            {intl.formatMessage(modelTypeTabsMessages.groupingHelpAriaLabel)}
          </Text>
          <Text size={2}>{intl.formatMessage(modelTypeTabsMessages.groupingHelpIntro)}</Text>
          <Text size={2}>{intl.formatMessage(modelTypeTabsMessages.groupingHelpExample)}</Text>
          <Text size={2}>{intl.formatMessage(modelTypeTabsMessages.groupingHelpCase)}</Text>
          <Text size={2}>{intl.formatMessage(modelTypeTabsMessages.groupingHelpScope)}</Text>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
