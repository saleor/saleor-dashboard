import { SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { Box, Text, Toggle } from "@saleor/macaw-ui-next";
import { Eye } from "lucide-react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { InfoCallout } from "../primitives";
import { ChannelSummary } from "../utils/types";

interface VisibleInListingsSectionProps {
  summary: ChannelSummary;
  onChange?: (visible: boolean) => void;
}

export const VisibleInListingsSection = ({ summary, onChange }: VisibleInListingsSectionProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center">
          <Eye
            size={18}
            color={
              summary.visibleInListings ? SUCCESS_ICON_COLOR : "var(--mu-colors-text-default2)"
            }
            strokeWidth={summary.visibleInListings ? 2 : 1.5}
          />
        </Box>
        <Text size={2} fontWeight="medium" __flex="1">
          {intl.formatMessage(messages.visibleInListingsLabel)}
        </Text>
        <Toggle
          pressed={summary.visibleInListings}
          onPressedChange={onChange}
          disabled={!onChange}
        />
      </Box>

      <Box marginLeft={8}>
        {summary.visibleInListings ? (
          <Text size={2} color="default2">
            {intl.formatMessage(messages.visibleInListingsOnDescription)}
          </Text>
        ) : (
          <InfoCallout>
            <Text size={2} fontWeight="medium">
              {intl.formatMessage(messages.visibleInListingsOffTitle)}
            </Text>{" "}
            {intl.formatMessage(messages.visibleInListingsOffDescription)}
          </InfoCallout>
        )}
      </Box>
    </Box>
  );
};
