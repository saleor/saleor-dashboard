import { useClipboard } from "@dashboard/hooks/useClipboard";
import { isExternalURL } from "@dashboard/utils/urls";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { ClipboardCopyIcon } from "./ClipboardCopyIcon";

interface TrackingNumberDisplayProps {
  trackingNumber: string;
  separator?: string;
}

export const TrackingNumberDisplay = ({
  trackingNumber,
  separator = ", ",
}: TrackingNumberDisplayProps): JSX.Element => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const [showCopyButton, setShowCopyButton] = useState(false);
  const isUrl = isExternalURL(trackingNumber);

  const trackingNumberContent = (
    <Text
      as={isUrl ? "a" : "span"}
      {...(isUrl ? { href: trackingNumber, target: "_blank", rel: "noopener noreferrer" } : {})}
      size={2}
      color={showCopyButton ? "default1" : "default2"}
      fontWeight="medium"
      textDecoration={isUrl ? { default: "none", hover: "underline" } : undefined}
      __transition="color 0.15s ease-in-out"
    >
      {trackingNumber}
    </Text>
  );

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={1}
      tabIndex={0}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
      onFocus={() => setShowCopyButton(true)}
      onBlur={() => setShowCopyButton(false)}
    >
      {separator ? (
        <Text color="default2" size={2}>
          {separator}
        </Text>
      ) : null}
      <Text color="default2" size={2} data-test-id="tracking-number-set">
        {intl.formatMessage(
          {
            defaultMessage: "Tracking: {trackingNumber}",
            id: "vMo6/3",
          },
          {
            trackingNumber: trackingNumberContent,
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
  );
};
