import { Box, Text } from "@saleor/macaw-ui-next";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  includes: {
    id: "PesQ3H",
    defaultMessage: "Unsaved changes: {segments}",
    description: "Savebar hint listing which dirty areas will persist on Save",
  },
});

interface SavebarCompositionHintProps {
  /** Localized segment labels (e.g. "general", "channel availability"). */
  segments: string[];
  "data-test-id"?: string;
}

/**
 * Presentational Savebar hint. Entity pages build `segments` from their own
 * save-composition flags, then render this shared chrome.
 *
 * Hidden on mobile so Cancel/Save stay usable in the fixed-height savebar.
 */
export const SavebarCompositionHint = ({
  segments,
  "data-test-id": dataTestId,
}: SavebarCompositionHintProps): JSX.Element | null => {
  const intl = useIntl();

  if (segments.length === 0) {
    return null;
  }

  return (
    <Box
      display={{ mobile: "none", tablet: "block", desktop: "block" }}
      __minWidth="0"
      __maxWidth="40%"
      overflow="hidden"
    >
      <Text size={2} color="default2" ellipsis data-test-id={dataTestId}>
        {intl.formatMessage(messages.includes, {
          segments: segments.join(", "),
        })}
      </Text>
    </Box>
  );
};
