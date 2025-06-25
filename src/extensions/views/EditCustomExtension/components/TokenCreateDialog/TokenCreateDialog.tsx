import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Mono } from "./Mono";
import { useClipboardCopy } from "./useClipboardCopy";

export interface TokenCreateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  token: string | undefined;
  onClose: () => void;
  onCreate: (name: string) => SubmitPromise;
}

type TokenCreateStep = "form" | "summary";

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
  const headers = createHeadersString(token ?? "");
  const { copyToClipboard: copyTokenToClipboard, copyState: tokenCopyState } = useClipboardCopy();
  const { copyToClipboard: copyHeaderToClipboard, copyState: headerCopyState } = useClipboardCopy();

  React.useEffect(() => {
    if (token) {
      setStep("summary");
    }
  }, [token]);
  useModalDialogOpen(open, {
    onClose: () => setStep("form"),
  });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <Form initial={{ name: "" }} onSubmit={data => onCreate(data.name)}>
          {({ change, data, submit }) => (
            <DashboardModal.Grid>
              <DashboardModal.Header>
                <FormattedMessage id="T5nU7u" defaultMessage="Create Token" description="header" />
              </DashboardModal.Header>

              {step === "form" ? (
                <>
                  <Text>
                    <FormattedMessage
                      id="k0rGBI"
                      defaultMessage="Access token is used to authenticate service accounts"
                    />
                  </Text>

                  <Input // Changed from TextField
                    label={intl.formatMessage({
                      id: "0DRBjg",
                      defaultMessage: "Token Note",
                    })}
                    value={data.name}
                    onChange={change}
                    width="100%" // Changed from fullWidth
                    name="name"
                  />
                </>
              ) : (
                <>
                  <Text>
                    <FormattedMessage
                      id="CiWUaq"
                      defaultMessage="Make sure to save token, you won't be able to see it again."
                    />
                  </Text>

                  <Box {...tokenPaperStyles}>
                    <Text size={4} fontWeight="medium">
                      <FormattedMessage id="5ZxAiY" defaultMessage="Token" />
                    </Text>

                    <Text data-test-id="generated-token" display="block">
                      <Mono>{token}</Mono>
                    </Text>

                    <ConfirmButton
                      noTransition
                      transitionState={tokenCopyState}
                      variant="secondary"
                      marginTop={2}
                      onClick={() => copyTokenToClipboard(token ?? "")}
                    >
                      <FormattedMessage
                        id="HVFq//"
                        defaultMessage="Copy token"
                        description="button"
                      />
                    </ConfirmButton>
                  </Box>

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
                      <ConfirmButton
                        noTransition
                        transitionState={headerCopyState}
                        variant="secondary"
                        onClick={() => copyHeaderToClipboard(headers)}
                      >
                        <FormattedMessage
                          id="ZhqH8J"
                          defaultMessage="Copy headers"
                          description="button"
                        />
                      </ConfirmButton>
                    </Box>
                  </Box>
                </>
              )}

              <DashboardModal.Actions>
                {step === "form" ? (
                  <>
                    <BackButton onClick={onClose} />
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
              </DashboardModal.Actions>
            </DashboardModal.Grid>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

TokenCreateDialog.displayName = "TokenCreateDialog";
export default TokenCreateDialog;
