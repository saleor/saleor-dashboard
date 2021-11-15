import { Button, DialogContent, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import useClipboard from "@saleor/hooks/useClipboard";
import useNotifier from "@saleor/hooks/useNotifier";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardCreateDialogMessages as messages } from "./messages";
import { useGiftCardCreateDialogCodeContentStyles as useStyles } from "./styles";

interface GiftCardCreateDialogCodeContentProps {
  cardCode: string;
  onClose: () => void;
}

const GiftCardCreateDialogCodeContent: React.FC<GiftCardCreateDialogCodeContentProps> = ({
  cardCode,
  onClose
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const notify = useNotifier();
  const [, copy] = useClipboard();

  const onCopyCode = () => {
    copy(cardCode);
    notify({
      status: "success",
      text: intl.formatMessage(messages.copiedToClipboardTitle)
    });
  };

  return (
    <DialogContent>
      <Typography>
        {intl.formatMessage(messages.createdGiftCardLabel)}
      </Typography>
      <VerticalSpacer />
      <Typography variant="h6" color="textSecondary" data-test-id="cardCode">
        {cardCode}
      </Typography>
      <VerticalSpacer spacing={2} />
      <div className={classes.buttonsContainer}>
        <Button onClick={onCopyCode}>
          {intl.formatMessage(messages.copyCodeLabel)}
        </Button>
        <HorizontalSpacer spacing={2} />
        <Button
          color="primary"
          variant="contained"
          onClick={onClose}
          data-test="submit"
        >
          {intl.formatMessage(buttonMessages.ok)}
        </Button>
      </div>
    </DialogContent>
  );
};

export default GiftCardCreateDialogCodeContent;
