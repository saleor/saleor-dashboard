import { Button, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { exitFormPromptMessages as messages } from "./messages";

const useStyles = makeStyles(
  () => ({
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }),
  { name: "ExitFormPrompt" }
);

interface ExitFormDialogProps {
  onSubmit: () => void;
  onClose: () => void;
  onLeave: () => void;
  isOpen: boolean;
}

const ExitFormDialog: React.FC<ExitFormDialogProps> = ({
  onSubmit,
  onLeave,
  onClose,
  isOpen
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Dialog className={classes.container} open={isOpen}>
      <CardTitle title={intl.formatMessage(messages.title)} onClose={onClose} />
      <DialogContent>
        <FormattedMessage {...messages.description} />
        <CardSpacer />
        <CardSpacer />
        <div className={classes.buttonsContainer}>
          <Button onClick={onLeave}>
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <HorizontalSpacer />
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {intl.formatMessage(messages.confirmButton)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitFormDialog;
