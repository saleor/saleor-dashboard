import { Button } from "@dashboard/components/Button";
import { DashboardModal } from "@dashboard/components/Modal";
import useClipboard from "@dashboard/hooks/useClipboard";
import useNotifier from "@dashboard/hooks/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import { Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";

interface GiftCardCreateDialogCodeContentProps {
  cardCode: string;
  onClose: () => void;
}

const GiftCardCreateDialogCodeContent: React.FC<GiftCardCreateDialogCodeContentProps> = ({
  cardCode,
  onClose,
}) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [, copy] = useClipboard();
  const onCopyCode = () => {
    copy(cardCode);
    notify({
      status: "success",
      text: intl.formatMessage(messages.copiedToClipboardTitle),
    });
  };

  return (
    <>
      <Typography>{intl.formatMessage(messages.createdGiftCardLabel)}</Typography>
      <Typography variant="h6" color="textSecondary" data-test-id="cardCode">
        {cardCode}
      </Typography>

      <DashboardModal.Actions>
        <Button onClick={onCopyCode} data-test-id="copy-code-button">
          {intl.formatMessage(messages.copyCodeLabel)}
        </Button>
        <Button variant="primary" onClick={onClose} data-test-id="submit">
          {intl.formatMessage(buttonMessages.ok)}
        </Button>
      </DashboardModal.Actions>
    </>
  );
};

export default GiftCardCreateDialogCodeContent;
