import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import { Button, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import { DialogHeader } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { exitFormPromptMessages as messages } from "./messages";

const useStyles = makeStyles(
  () => ({
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    dialogContent: {
      "@media (min-width: 800px)": {
        minWidth: 500,
      },
      paddingTop: 0,
    },
  }),
  { name: "ExitFormPrompt" },
);

interface ExitFormDialogProps {
  onClose: () => void;
  onLeave: () => void;
  isOpen: boolean;
}

const ExitFormDialog: React.FC<ExitFormDialogProps> = ({ onLeave, onClose, isOpen }) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Dialog className={classes.container} open={isOpen} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        {intl.formatMessage(messages.unableToSaveTitle)}
      </DialogHeader>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.buttonsContainer}>
          <Button onClick={onClose} data-test-id="keep-editing">
            {intl.formatMessage(messages.keepEditing)}
          </Button>
          <HorizontalSpacer />
          <Button
            variant="contained"
            color="primary"
            onClick={onLeave}
            data-test-id="ignore-changes"
          >
            {intl.formatMessage(messages.ignoreChanges)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitFormDialog;
