import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Modal
} from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { makeStyles } from "@saleor/theme";
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
    content: {
      maxWidth: 600
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }),
  { name: "ExitFormPrompt" }
);

interface ExitFormPromptProps {
  onSubmit: () => void;
  onClose: () => void;
  onLeave: () => void;
  isOpen: boolean;
}

const ExitFormPrompt: React.FC<ExitFormPromptProps> = ({
  onSubmit,
  onLeave,
  onClose,
  isOpen
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Dialog className={classes.container} open={isOpen} onClose={onClose}>
      {/* <Card className={classes.content}> */}
      <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
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
      {/* <CardContent>
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
        </CardContent> */}
      {/* </Card> */}
    </Dialog>
  );
};

export default ExitFormPrompt;
