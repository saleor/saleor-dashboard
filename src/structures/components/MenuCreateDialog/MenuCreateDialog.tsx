import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type MenuErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { Input } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface MenuCreateDialogFormData {
  name: string;
}

interface MenuCreateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: MenuErrorFragment[];
  onClose: () => void;
  onConfirm: (data: MenuCreateDialogFormData) => void;
  open: boolean;
}

const initialForm: MenuCreateDialogFormData = {
  name: "",
};

export const MenuCreateDialog = ({
  confirmButtonState,
  errors,
  onClose,
  onConfirm,
  open,
}: MenuCreateDialogProps): JSX.Element => {
  const intl = useIntl();
  const isSubmittingRef = useRef(false);
  const formErrors = getFormErrors(["name"], errors);

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
        <Form initial={initialForm} onSubmit={onConfirm}>
          {({ change, data, submit, isSubmitting }) => {
            const isMutationLoading = confirmButtonState === "loading";
            const isActionsDisabled = isSubmitting || isMutationLoading;

            isSubmittingRef.current = isActionsDisabled;

            return (
              <DashboardModal.Content size="sm">
                <DashboardModal.ContextHeader data-test-id="create-menu-dialog-title">
                  <FormattedMessage
                    description="dialog header"
                    id="pSb46V"
                    defaultMessage="Create structure"
                  />
                </DashboardModal.ContextHeader>

                <DashboardModal.Body>
                  <DashboardModal.Inset>
                    <Input
                      data-test-id="menu-name-input"
                      disabled={isActionsDisabled}
                      error={!!formErrors.name}
                      helperText={getMenuErrorMessage(formErrors.name, intl)}
                      label={intl.formatMessage({
                        id: "5KS3f4",
                        defaultMessage: "Structure title",
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

MenuCreateDialog.displayName = "MenuCreateDialog";
