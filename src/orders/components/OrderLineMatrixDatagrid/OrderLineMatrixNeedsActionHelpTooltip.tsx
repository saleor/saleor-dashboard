import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderLineMatrixNeedsActionHelpTooltip.module.css";

export const OrderLineMatrixNeedsActionHelpTooltip = (): JSX.Element => {
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
          aria-label={intl.formatMessage(messages.needsActionHelpAriaLabel)}
          data-test-id="matrix-needs-action-help"
          onClick={event => event.stopPropagation()}
        >
          <CircleHelp
            size={iconSize.small}
            strokeWidth={iconStrokeWidthBySize.small}
            color="var(--mu-colors-text-default2)"
          />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" align="end">
        <Tooltip.Arrow />
        <Box className={styles.content} display="flex" flexDirection="column" gap={3}>
          <Text size={2} fontWeight="bold">
            <FormattedMessage {...messages.needsActionHelpTitle} />
          </Text>

          <Box display="flex" flexDirection="column" gap={1.5}>
            <Text size={2} fontWeight="medium">
              <FormattedMessage {...messages.needsActionHelpHighlightedLabel} />
            </Text>
            <ul className={styles.list}>
              <li>
                <Text size={2}>
                  <FormattedMessage {...messages.needsActionHelpPendingApproval} />
                </Text>
              </li>
              <li>
                <Text size={2}>
                  <FormattedMessage {...messages.needsActionHelpDraftRefund} />
                </Text>
              </li>
              <li>
                <Text size={2}>
                  <FormattedMessage {...messages.needsActionHelpFailedRefund} />
                </Text>
              </li>
            </ul>
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Text size={2} fontWeight="medium">
              <FormattedMessage {...messages.needsActionHelpOtherLinesLabel} />
            </Text>
            <Text size={2} color="default2">
              <FormattedMessage {...messages.needsActionHelpOtherLinesBody} />
            </Text>
          </Box>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
