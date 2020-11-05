import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

interface TranslationFieldsSaveProps {
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSave: () => void;
}

const useStyles = makeStyles(
  theme => ({
    confirmButton: {
      marginLeft: theme.spacing(1)
    },
    root: {
      display: "flex",
      flexDirection: "row-reverse",
      marginTop: theme.spacing(1)
    }
  }),
  {
    name: "TranslationFieldsSave"
  }
);

const TranslationFieldsSave: React.FC<TranslationFieldsSaveProps> = props => {
  const { saveButtonState, onDiscard, onSave } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <ConfirmButton
        className={classes.confirmButton}
        transitionState={saveButtonState}
        onClick={onSave}
      >
        <FormattedMessage {...buttonMessages.save} />
      </ConfirmButton>
      <Button onClick={onDiscard} type="submit">
        <FormattedMessage defaultMessage="Discard" description="button" />
      </Button>
    </div>
  );
};
TranslationFieldsSave.displayName = "TranslationFieldsSave";
export default TranslationFieldsSave;
