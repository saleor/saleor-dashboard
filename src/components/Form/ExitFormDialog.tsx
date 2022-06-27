import { Button, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardTitle from "@saleor/components/CardTitle";
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
  onSubmit: () => void;
  onClose: () => void;
  onLeave: () => void;
  isOpen: boolean;
  isSubmitDisabled: boolean;
}

const ExitFormDialog: React.FC<ExitFormDialogProps> = ({
  onSubmit,
  onLeave,
  onClose,
  isOpen,
  isSubmitDisabled,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Dialog className={classes.container} open={isOpen} onClose={onClose}>
      <CardTitle
        title={intl.formatMessage(
          isSubmitDisabled ? messages.unableToSaveTitle : messages.title,
        )}
      />
      <DialogContent className={classes.dialogContent}>
        <div className={classes.buttonsContainer}>
          <Button onClick={onLeave} data-test-id="leave-without-saving">
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <HorizontalSpacer />
          <Button
            variant="contained"
            color="primary"
            onClick={isSubmitDisabled ? onClose : onSubmit}
            data-test-id="save-and-continue"
          >
            {intl.formatMessage(
              isSubmitDisabled
                ? messages.continueEditingButton
                : messages.confirmButton,
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitFormDialog;
