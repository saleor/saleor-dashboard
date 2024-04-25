import { Button } from "@dashboard/components/Button";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import useClipboard from "@dashboard/hooks/useClipboard";
import useNotifier from "@dashboard/hooks/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import { DialogActions, DialogContent, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";
import { useGiftCardCreateDialogCodeContentStyles as useStyles } from "./styles";

interface GiftCardCreateDialogCodeContentProps {
  cardCode: string;
  onClose: () => void;
}

const GiftCardCreateDialogCodeContent: React.FC<GiftCardCreateDialogCodeContentProps> = ({
  cardCode,
  onClose,
}) => {
  const classes = useStyles({});
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
    <div className={classes.content}>
      <DialogContent>
        <Typography>{intl.formatMessage(messages.createdGiftCardLabel)}</Typography>
        <VerticalSpacer />
        <Typography variant="h6" color="textSecondary" data-test-id="cardCode">
          {cardCode}
        </Typography>
        <VerticalSpacer spacing={2} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCopyCode} data-test-id="copy-code-button">
          {intl.formatMessage(messages.copyCodeLabel)}
        </Button>
        <HorizontalSpacer spacing={2} />
        <Button variant="primary" onClick={onClose} data-test-id="submit">
          {intl.formatMessage(buttonMessages.ok)}
        </Button>
      </DialogActions>
    </div>
  );
};

export default GiftCardCreateDialogCodeContent;
