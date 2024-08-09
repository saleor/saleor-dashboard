// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { getApiUrl } from "@dashboard/config";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Mono } from "./Mono";

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

const tokenPaperStyles = {
  padding: 4,
  backgroundColor: "default2",
  borderRadius: 4,
  __whiteSpace: "pre-wrap",
} as const;

const createHeadersString = (token: string) => `{\n  "authorization": "Bearer ${token}"\n}`;
const TokenCreateDialog: React.FC<TokenCreateDialogProps> = props => {
  const { confirmButtonState, open, token, onClose, onCreate } = props;
  const [step, setStep] = React.useState<TokenCreateStep>("form");
  const intl = useIntl();
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
                  <Box {...tokenPaperStyles}>
                    <Text size={4} fontWeight="medium">
                      <FormattedMessage id="5ZxAiY" defaultMessage="Token" />
                    </Text>
                    <Text data-test-id="generated-token" display="block">
                      <Mono>{token}</Mono>
                    </Text>
                    <Button variant="secondary" marginTop={2} onClick={() => handleCopy(token)}>
                      <FormattedMessage
                        id="HVFq//"
                        defaultMessage="Copy token"
                        description="button"
                      />
                    </Button>
                  </Box>
                  <CardSpacer />
                  <Box {...tokenPaperStyles}>
                    <Text size={4} fontWeight="medium">
                      <FormattedMessage id="Wm+KUd" defaultMessage="Headers" />
                    </Text>
                    <Text data-test-id="generated-headers" display="block">
                      <Mono>{headers}</Mono>
                    </Text>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap={2}
                      marginTop={2}
                    >
                      <Button variant="secondary" onClick={() => handleCopy(headers)}>
                        <FormattedMessage
                          id="ZhqH8J"
                          defaultMessage="Copy headers"
                          description="button"
                        />
                      </Button>
                      <Button variant="secondary" onClick={openPlayground}>
                        <FormattedMessage
                          id="0KmZCN"
                          defaultMessage="Open playground"
                          description="button"
                        />
                      </Button>
                    </Box>
                  </Box>
                  <CardSpacer />
                </>
              )}
            </DialogContent>
            <DialogActions>
              {step === "form" ? (
                <>
                  <BackButton marginRight={1} onClick={onClose} />
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
