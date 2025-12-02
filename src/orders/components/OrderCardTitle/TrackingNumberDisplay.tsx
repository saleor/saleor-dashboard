import { useClipboard } from "@dashboard/hooks/useClipboard";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { ClipboardCopyIcon } from "./ClipboardCopyIcon";

interface TrackingNumberDisplayProps {
  trackingNumber: string;
}

export const TrackingNumberDisplay = ({
  trackingNumber,
}: TrackingNumberDisplayProps): JSX.Element => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const [showCopyButton, setShowCopyButton] = useState(false);

  return (
    <>
      <Text color="default2" size={2} marginRight={1}>
        {", "}
      </Text>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        onMouseEnter={() => setShowCopyButton(true)}
        onMouseLeave={() => setShowCopyButton(false)}
      >
        <Text
          color="default2"
          size={2}
          onFocus={() => setShowCopyButton(true)}
          onBlur={() => setShowCopyButton(false)}
        >
          {intl.formatMessage(
            {
              defaultMessage: "Tracking: {trackingNumber}",
              id: "vMo6/3",
            },
            {
              trackingNumber: (
                <Text size={2} color="default1" fontWeight="medium">
                  {trackingNumber}
                </Text>
              ),
            },
          )}
        </Text>
        <Box __opacity={showCopyButton ? 1 : 0} pointerEvents={showCopyButton ? "auto" : "none"}>
          <Button
            variant="tertiary"
            size="small"
            icon={<ClipboardCopyIcon hasBeenClicked={copied} />}
            onClick={() => copy(trackingNumber)}
            aria-label={intl.formatMessage({
              defaultMessage: "Copy tracking number",
              id: "0KVj6r",
            })}
          />
        </Box>
      </Box>
    </>
  );
};
