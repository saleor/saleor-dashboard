import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Input } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface SaveFilterTabDialogFormData {
  name: string;
}

const initialForm: SaveFilterTabDialogFormData = {
  name: "",
};

interface SaveFilterTabDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SaveFilterTabDialogFormData) => void;
}

export const SaveFilterTabDialog = ({
  confirmButtonState,
  onClose,
  onSubmit,
  open,
}: SaveFilterTabDialogProps): JSX.Element => {
  const intl = useIntl();
  const isSubmittingRef = useRef(false);

  useEffect(
    function resetSubmittingRefWhenDialogCloses() {
      if (!open) {
        isSubmittingRef.current = false;
      }
    },
    [open],
  );

  const handleClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        <Form
          initial={initialForm}
          onSubmit={data => {
            const name = data.name.trim();

            if (!name) {
              return;
            }

            onSubmit({ name });
          }}
        >
          {({ change, data, submit, isSubmitting }) => {
            const isMutationLoading = confirmButtonState === "loading";
            const isActionsDisabled = isSubmitting || isMutationLoading;

            isSubmittingRef.current = isActionsDisabled;

            return (
              <DashboardModal.Content size="xs">
                <DashboardModal.ContextHeader>
                  <FormattedMessage
                    id="P9YktI"
                    defaultMessage="Save view preset"
                    description="save preset, header"
                  />
                </DashboardModal.ContextHeader>

                <DashboardModal.Body>
                  <DashboardModal.Inset>
                    <Input
                      autoFocus
                      data-test-id="preset-name-text-field"
                      disabled={isActionsDisabled}
                      label={intl.formatMessage({
                        id: "zhnwl6",
                        defaultMessage: "Preset name",
                        description: "save preset name",
                      })}
                      name="name"
                      onChange={change}
                      value={data.name}
                      width="100%"
                    />
                  </DashboardModal.Inset>
                </DashboardModal.Body>

                <DashboardModal.Actions>
                  <BackButton
                    data-test-id="cancel-preset-button"
                    disabled={isActionsDisabled}
                    onClick={handleClose}
                  />
                  <ConfirmButton
                    data-test-id="save-preset-button"
                    disabled={!data.name.trim() || isActionsDisabled}
                    onClick={submit}
                    transitionState={
                      isMutationLoading ? confirmButtonState : isSubmitting ? "loading" : "default"
                    }
                  >
                    <FormattedMessage {...buttonMessages.save} />
                  </ConfirmButton>
                </DashboardModal.Actions>
              </DashboardModal.Content>
            );
          }}
        </Form>
      ) : null}
    </DashboardModal>
  );
};

SaveFilterTabDialog.displayName = "SaveFilterTabDialog";
