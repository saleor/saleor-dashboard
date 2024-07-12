// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { Button } from "@dashboard/components/Button";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { getApiUrl } from "@dashboard/config";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface TokenCreateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  token: string | undefined;
  onClose: () => void;
  onCreate: (name: string) => SubmitPromise;
}

type TokenCreateStep = "form" | "summary";

function handleCopy(token: string) {
  navigator.clipboard.writeText(token);
}

const Mono = ({ children, className }) => <span className={className}>{children}</span>;
const createHeadersString = (token: string) => `{\n  "authorization": "Bearer ${token}"\n}`;
const TokenCreateDialog: React.FC<TokenCreateDialogProps> = props => {
  const { confirmButtonState, open, token, onClose, onCreate } = props;
  const [step, setStep] = React.useState<TokenCreateStep>("form");
  const intl = useIntl();
  const classes = useStyles(props);
  const headers = createHeadersString(token);

  React.useEffect(() => {
    if (token !== undefined) {
      setStep("summary");
    }
  }, [token]);
  useModalDialogOpen(open, {
    onClose: () => setStep("form"),
  });

  const openPlayground = () => {
    window.open(getApiUrl(), "_blank");
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <Form initial={{ name: "" }} onSubmit={data => onCreate(data.name)}>
        {({ change, data, submit }) => (
          <>
            <DialogTitle disableTypography>
              <FormattedMessage id="T5nU7u" defaultMessage="Create Token" description="header" />
            </DialogTitle>
            <DialogContent>
              {step === "form" ? (
                <>
                  <Text>
                    <FormattedMessage
                      id="k0rGBI"
                      defaultMessage="Access token is used to authenticate service accounts"
                    />
                  </Text>
                  <FormSpacer />
                  <TextField
                    label={intl.formatMessage({
                      id: "0DRBjg",
                      defaultMessage: "Token Note",
                    })}
                    value={data.name}
                    onChange={change}
                    fullWidth
                    name="name"
                  />
                </>
              ) : (
                <>
                  <Text>
                    <FormattedMessage
                      id="4T/RzC"
                      defaultMessage="Make sure to save token, you won’t be able to see it again."
                    />
                  </Text>
                  <CardSpacer />
                  <Paper className={classes.paper} elevation={0}>
                    <Text size={2} fontWeight="light">
                      <FormattedMessage id="5ZxAiY" defaultMessage="Token" />
                    </Text>
                    <Text data-test-id="generated-token">
                      <Mono className={classes.mono}>{token}</Mono>
                    </Text>
                    <Button className={classes.copy} onClick={() => handleCopy(token)}>
                      <FormattedMessage
                        id="HVFq//"
                        defaultMessage="Copy token"
                        description="button"
                      />
                    </Button>
                  </Paper>
                  <CardSpacer />
                  <Paper className={classes.paper} elevation={0}>
                    <Text size={2} fontWeight="light">
                      <FormattedMessage id="Wm+KUd" defaultMessage="Headers" />
                    </Text>
                    <Text data-test-id="generated-headers">
                      <Mono className={classes.mono}>{headers}</Mono>
                    </Text>
                    <Button className={classes.copy} onClick={() => handleCopy(headers)}>
                      <FormattedMessage
                        id="ZhqH8J"
                        defaultMessage="Copy headers"
                        description="button"
                      />
                    </Button>
                    <Button className={classes.copy} onClick={openPlayground}>
                      <FormattedMessage
                        id="0KmZCN"
                        defaultMessage="Open playground"
                        description="button"
                      />
                    </Button>
                  </Paper>
                  <CardSpacer />
                </>
              )}
            </DialogContent>
            <DialogActions>
              {step === "form" ? (
                <>
                  <BackButton className={classes.cancel} onClick={onClose} />
                  <ConfirmButton
                    data-test-id="submit"
                    transitionState={confirmButtonState}
                    onClick={submit}
                  >
                    <FormattedMessage
                      id="isM94c"
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
