import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { TriangleAlert } from "lucide-react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

import { RAIL_OVERLAY_OFFSET } from "../menu/RailItem";
import { useLabelTooltip } from "../menu/useLabelTooltip";
import { deprecationBannerMessages } from "./messages";

interface DeprecationBannerContentProps {
  upgradeDate: Date;
}

const DeprecationMessage = ({ upgradeDate }: DeprecationBannerContentProps) => (
  <FormattedMessage
    {...deprecationBannerMessages.message}
    values={{
      date: <FormattedDate value={upgradeDate} year="numeric" month="long" day="numeric" />,
    }}
  />
);

export const DeprecationBannerContent = ({ upgradeDate }: DeprecationBannerContentProps) => (
  <Box
    display="flex"
    gap={2}
    paddingX={4}
    paddingY={3}
    backgroundColor="critical1"
    alignItems="flex-start"
    data-test-id="deprecation-banner"
  >
    <Box display="flex" alignItems="center" color="critical2" __paddingTop="2px">
      <TriangleAlert size={16} />
    </Box>
    <Text size={2} color="critical2">
      <DeprecationMessage upgradeDate={upgradeDate} />
    </Text>
  </Box>
);

/** The collapsed rail has no room for the sentence, so the warning moves into a tooltip. */
export const DeprecationBannerIcon = ({ upgradeDate }: DeprecationBannerContentProps) => {
  const intl = useIntl();
  const message = intl.formatMessage(deprecationBannerMessages.message, {
    date: intl.formatDate(upgradeDate, { year: "numeric", month: "long", day: "numeric" }),
  });
  const tooltip = useLabelTooltip();

  return (
    <Box display="flex" justifyContent="center" paddingBottom={2}>
      <Tooltip {...tooltip.rootProps}>
        <Tooltip.Trigger>
          <Box
            as="span"
            role="img"
            aria-label={message}
            tabIndex={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            __width="36px"
            __height="32px"
            borderRadius={3}
            backgroundColor="critical1"
            color="critical2"
            data-test-id="deprecation-banner"
          >
            <TriangleAlert size={16} aria-hidden />
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={RAIL_OVERLAY_OFFSET}>
          <Box __maxWidth="240px">
            <Text size={2} color="critical2">
              {message}
            </Text>
          </Box>
        </Tooltip.Content>
      </Tooltip>
    </Box>
  );
};
