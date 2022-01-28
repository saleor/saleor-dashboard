import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import CardSpacer from "@saleor/components/CardSpacer";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import { buttonMessages } from "@saleor/intl";
import { Button, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface TokenCreateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  token: string | undefined;
  onClose: () => void;
  onCreate: (name: string) => void;
}

type TokenCreateStep = "form" | "summary";

function handleCopy(token: string) {
  navigator.clipboard.writeText(token);
}

const TokenCreateDialog: React.FC<TokenCreateDialogProps> = props => {
  const { confirmButtonState, open, token, onClose, onCreate } = props;
  const [step, setStep] = React.useState<TokenCreateStep>("form");
  const intl = useIntl();
  const classes = useStyles(props);

  React.useEffect(() => {
    if (token !== undefined) {
      setStep("summary");
    }
  }, [token]);

  useModalDialogOpen(open, {
    onClose: () => setStep("form")
  });

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <Form initial={{ name: "" }} onSubmit={data => onCreate(data.name)}>
        {({ change, data, submit }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Create Token"
                description="header"
              />
            </DialogTitle>
            <DialogContent>
              {step === "form" ? (
                <>
                  <Typography>
                    <FormattedMessage defaultMessage="Access token is used to authenticate service accounts" />
                  </Typography>
                  <FormSpacer />
                  <TextField
                    label={intl.formatMessage({
                      defaultMessage: "Token Note"
                    })}
                    value={data.name}
                    onChange={change}
                    fullWidth
                    name="name"
                  />
                </>
              ) : (
                <>
                  <Typography>
                    <FormattedMessage defaultMessage="We’ve created your token. Make sure to copy your new personal access token now. You won’t be able to see it again." />
                  </Typography>
                  <CardSpacer />
                  <Paper className={classes.paper} elevation={0}>
                    <Typography variant="caption">
                      <FormattedMessage defaultMessage="Generated Token" />
                    </Typography>
                    <Typography data-test-id="generatedToken">
                      {token}
                    </Typography>
                    <Button
                      className={classes.copy}
                      onClick={() => handleCopy(token)}
                    >
                      <FormattedMessage
                        defaultMessage="Copy token"
                        description="button"
                      />
                    </Button>
                  </Paper>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {step === "form" ? (
                <>
                  <BackButton className={classes.cancel} onClick={onClose} />
                  <ConfirmButton
                    data-test="submit"
                    transitionState={confirmButtonState}
                    onClick={submit}
                  >
                    <FormattedMessage
                      defaultMessage="Create"
                      description="create service token, button"
                    />
                  </ConfirmButton>
                </>
              ) : (
                <Button variant="primary" onClick={onClose} data-test-id="done">
                  <FormattedMessage {...buttonMessages.done} />
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

TokenCreateDialog.displayName = "TokenCreateDialog";
export default TokenCreateDialog;
