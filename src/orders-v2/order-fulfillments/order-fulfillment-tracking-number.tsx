import { useClipboard } from "@dashboard/hooks/useClipboard";
import { Button, sprinkles, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { ClipboardCopyIcon } from "../clipboard-copy-icon";

export const OrderFulfillmentTrackingNumber = ({ trackingNumber }: { trackingNumber: string }) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const [showCopyButton, setShowCopyButton] = useState(false);

  return (
    <>
      <Text color="default2" size={2}>
        |
      </Text>
      <Text
        size={2}
        color="default2"
        onMouseEnter={() => setShowCopyButton(true)}
        onMouseLeave={() => setShowCopyButton(false)}
        cursor="pointer"
        onClick={() => copy(trackingNumber)}
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
      <Button
        variant="tertiary"
        size="small"
        icon={<ClipboardCopyIcon hasBeenClicked={copied} />}
        onClick={() => copy(trackingNumber)}
        className={sprinkles({
          opacity: showCopyButton ? "1" : "0",
        })}
      />
    </>
  );
};
