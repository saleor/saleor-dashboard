import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { buttonMessages } from "@saleor/intl";

interface TranslationFieldsSaveProps {
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSave: () => void;
}

const styles = theme =>
  createStyles({
    confirmButton: {
      marginLeft: theme.spacing(1)
    },
    root: {
      display: "flex",
      flexDirection: "row-reverse",
      marginTop: theme.spacing(1)
    }
  });

const TranslationFieldsSave = withStyles(styles, {
  name: "TranslationFieldsSave"
})(
  ({
    classes,
    saveButtonState,
    onDiscard,
    onSave
  }: TranslationFieldsSaveProps & WithStyles<typeof styles>) => (
    <div className={classes.root}>
      <ConfirmButton
        className={classes.confirmButton}
        transitionState={saveButtonState}
        onClick={onSave}
      >
        <FormattedMessage {...buttonMessages.save} />
      </ConfirmButton>
      <Button onClick={onDiscard}>
        <FormattedMessage defaultMessage="Discard" description="button" />
      </Button>
    </div>
  )
);
TranslationFieldsSave.displayName = "TranslationFieldsSave";
export default TranslationFieldsSave;
