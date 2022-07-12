import ConfirmButton from "@saleor/components/ConfirmButton";
import { buttonMessages } from "@saleor/intl";
import {
  Button,
  ConfirmButtonTransitionState,
  makeStyles,
} from "@saleor/macaw-ui";
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
      marginLeft: theme.spacing(1),
    },
    root: {
      display: "flex",
      flexDirection: "row-reverse",
      marginTop: theme.spacing(1),
    },
  }),
  {
    name: "TranslationFieldsSave",
  },
);

const TranslationFieldsSave: React.FC<TranslationFieldsSaveProps> = props => {
  const { saveButtonState, onDiscard, onSave } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <ConfirmButton
        data-test="button-bar-confirm"
        className={classes.confirmButton}
        transitionState={saveButtonState}
        onClick={onSave}
      >
        <FormattedMessage {...buttonMessages.save} />
      </ConfirmButton>
      <Button onClick={onDiscard} type="submit">
        <FormattedMessage
          id="vTN5DZ"
          defaultMessage="Discard"
          description="button"
        />
      </Button>
    </div>
  );
};
TranslationFieldsSave.displayName = "TranslationFieldsSave";
export default TranslationFieldsSave;
