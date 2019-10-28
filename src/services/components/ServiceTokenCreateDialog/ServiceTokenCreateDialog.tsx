import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { fade } from "@material-ui/core/styles/colorManipulator";
import CardSpacer from "@saleor/components/CardSpacer";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import { buttonMessages } from "@saleor/intl";

export interface ServiceTokenCreateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  token: string | undefined;
  onClose: () => void;
  onCreate: (name: string) => void;
}

type ServiceTokenCreateStep = "form" | "summary";

const useStyles = makeStyles(
  theme => ({
    cancel: {
      marginRight: theme.spacing(1)
    },
    copy: {
      marginTop: theme.spacing(),
      position: "relative",
      right: theme.spacing(1)
    },
    paper: {
      background: fade(theme.palette.primary.main, 0.05),
      padding: theme.spacing(2, 3)
    }
  }),
  {
    name: "ServiceTokenCreateDialog"
  }
);

function handleCopy(token: string) {
  navigator.clipboard.writeText(token);
}

const ServiceTokenCreateDialog: React.FC<
  ServiceTokenCreateDialogProps
> = props => {
  const { confirmButtonState, open, token, onClose, onCreate } = props;
  const [step, setStep] = React.useState<ServiceTokenCreateStep>("form");
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
                    <Typography>{token}</Typography>
                    <Button
                      className={classes.copy}
                      color="primary"
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
                  <Button
                    className={classes.cancel}
                    color="primary"
                    onClick={onClose}
                  >
                    <FormattedMessage {...buttonMessages.back} />
                  </Button>
                  <ConfirmButton
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
                <Button color="primary" variant="contained" onClick={onClose}>
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

ServiceTokenCreateDialog.displayName = "ServiceTokenCreateDialog";
export default ServiceTokenCreateDialog;
