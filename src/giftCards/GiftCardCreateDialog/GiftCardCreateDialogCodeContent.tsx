import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { MONO_FONT_FAMILY } from "@dashboard/styles/monoFontFamily";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";

const COPY_BUTTON_RESET_MS = 2000;

interface GiftCardCreateDialogCodeContentProps {
  cardCode: string;
}

export const GiftCardCreateDialogCodeContent = ({
  cardCode,
}: GiftCardCreateDialogCodeContentProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [copyState, setCopyState] = useState<ConfirmButtonTransitionState>("default");
  const timeoutRef = useRef<number>();

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handleCopy = () => {
    navigator.clipboard
      .writeText(cardCode)
      .then(() => {
        setCopyState("success");
      })
      .catch(() => {
        setCopyState("error");
        notify({
          status: "error",
          text: intl.formatMessage(messages.copyCodeError),
        });
      })
      .finally(() => {
        timeoutRef.current = window.setTimeout(() => {
          setCopyState("default");
        }, COPY_BUTTON_RESET_MS);
      });
  };

  return (
    <Box
      backgroundColor="default2"
      borderRadius={4}
      display="flex"
      flexDirection="column"
      gap={3}
      padding={4}
    >
      <Text fontWeight="medium" size={3}>
        <FormattedMessage {...messages.successCodeLabel} />
      </Text>
      <Box alignItems="center" display="flex" gap={3} justifyContent="space-between">
        <Text
          data-test-id="gift-card-created-code"
          __flex="1"
          fontWeight="bold"
          size={5}
          style={{ fontFamily: MONO_FONT_FAMILY, minWidth: 0, wordBreak: "break-all" }}
        >
          {cardCode}
        </Text>
        <Box __flexShrink={0}>
          <ConfirmButton
            noTransition
            onClick={handleCopy}
            transitionState={copyState}
            variant="secondary"
          >
            <FormattedMessage {...messages.copyCodeLabel} />
          </ConfirmButton>
        </Box>
      </Box>
    </Box>
  );
};
