import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Mono } from "./Mono";
import { useClipboardCopy } from "./useClipboardCopy";

interface TokenCreateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  token: string | undefined;
  onClose: () => void;
  onCreate: (name: string) => SubmitPromise;
}

type TokenCreateStep = "form" | "summary";

const createHeadersString = (token: string): string => `{\n  "authorization": "Bearer ${token}"\n}`;

export const TokenCreateDialog = ({
  confirmButtonState,
  open,
  token,
  onClose,
  onCreate,
}: TokenCreateDialogProps): JSX.Element => {
  const intl = useIntl();
  const isSubmittingRef = useRef(false);
  const step: TokenCreateStep = token ? "summary" : "form";
  const headers = createHeadersString(token ?? "");
  const { copyToClipboard: copyTokenToClipboard, copyState: tokenCopyState } = useClipboardCopy();
  const { copyToClipboard: copyHeaderToClipboard, copyState: headerCopyState } = useClipboardCopy();

  useEffect(
    function resetSubmittingRefWhenDialogCloses() {
      if (!open) {
        isSubmittingRef.current = false;
      }
    },
    [open],
  );

  const handleClose = (): void => {
    if (step === "form" && isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        step === "form" ? (
          <Form
            initial={{ name: "" }}
            onSubmit={data => {
              const name = data.name.trim();

              if (!name) {
                return Promise.resolve([]);
              }

              return onCreate(name);
            }}
          >
            {({ change, data, submit, isSubmitting }) => {
              const isMutationLoading = confirmButtonState === "loading";
              const isActionsDisabled = isSubmitting || isMutationLoading;

              isSubmittingRef.current = isActionsDisabled;

              return (
                <DashboardModal.Content size="sm">
                  <DashboardModal.ContextHeader
                    description={
                      <FormattedMessage
                        id="k0rGBI"
                        defaultMessage="Access token is used to authenticate service accounts"
                      />
                    }
                  >
                    <FormattedMessage
                      id="T5nU7u"
                      defaultMessage="Create Token"
                      description="header"
                    />
                  </DashboardModal.ContextHeader>

                  <DashboardModal.Body>
                    <DashboardModal.Inset>
                      <Input
                        autoFocus
                        label={intl.formatMessage({
                          id: "0DRBjg",
                          defaultMessage: "Token Note",
                        })}
                        name="name"
                        onChange={change}
                        value={data.name}
                        width="100%"
                      />
                    </DashboardModal.Inset>
                  </DashboardModal.Body>

                  <DashboardModal.Actions>
                    <BackButton disabled={isActionsDisabled} onClick={handleClose} />
                    <ConfirmButton
                      data-test-id="submit"
                      disabled={!data.name.trim() || isActionsDisabled}
                      onClick={submit}
                      transitionState={
                        isMutationLoading
                          ? confirmButtonState
                          : isSubmitting
                            ? "loading"
                            : "default"
                      }
                    >
                      <FormattedMessage
                        id="isM94c"
                        defaultMessage="Create"
                        description="create service token, button"
                      />
                    </ConfirmButton>
                  </DashboardModal.Actions>
                </DashboardModal.Content>
              );
            }}
          </Form>
        ) : (
          <DashboardModal.Content size="sm">
            <DashboardModal.ContextHeader
              description={
                <FormattedMessage
                  id="CiWUaq"
                  defaultMessage="Make sure to save token, you won't be able to see it again."
                />
              }
            >
              <FormattedMessage id="T5nU7u" defaultMessage="Create Token" description="header" />
            </DashboardModal.ContextHeader>

            <DashboardModal.Body>
              <DashboardModal.Inset>
                <Box display="flex" flexDirection="column" gap={4}>
                  <Box
                    backgroundColor="default2"
                    borderRadius={4}
                    padding={4}
                    __whiteSpace="pre-wrap"
                  >
                    <Title2>
                      <FormattedMessage id="5ZxAiY" defaultMessage="Token" />
                    </Title2>

                    <Text data-test-id="generated-token" display="block">
                      <Mono>{token}</Mono>
                    </Text>

                    <ConfirmButton
                      marginTop={2}
                      noTransition
                      onClick={() => copyTokenToClipboard(token ?? "")}
                      transitionState={tokenCopyState}
                      variant="secondary"
                    >
                      <FormattedMessage
                        id="HVFq//"
                        defaultMessage="Copy token"
                        description="button"
                      />
                    </ConfirmButton>
                  </Box>

                  <Box
                    backgroundColor="default2"
                    borderRadius={4}
                    padding={4}
                    __whiteSpace="pre-wrap"
                  >
                    <Title2>
                      <FormattedMessage id="Wm+KUd" defaultMessage="Headers" />
                    </Title2>

                    <Text data-test-id="generated-headers" display="block">
                      <Mono>{headers}</Mono>
                    </Text>

                    <ConfirmButton
                      marginTop={2}
                      noTransition
                      onClick={() => copyHeaderToClipboard(headers)}
                      transitionState={headerCopyState}
                      variant="secondary"
                    >
                      <FormattedMessage
                        id="ZhqH8J"
                        defaultMessage="Copy headers"
                        description="button"
                      />
                    </ConfirmButton>
                  </Box>
                </Box>
              </DashboardModal.Inset>
            </DashboardModal.Body>

            <DashboardModal.Actions>
              <Button data-test-id="done" onClick={handleClose} variant="primary">
                <FormattedMessage {...buttonMessages.done} />
              </Button>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        )
      ) : null}
    </DashboardModal>
  );
};

TokenCreateDialog.displayName = "TokenCreateDialog";
