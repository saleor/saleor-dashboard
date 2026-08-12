import AccountPermissionGroups from "@dashboard/components/AccountPermissionGroups";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type SearchPermissionGroupsQuery, type StaffErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { commonMessages } from "@dashboard/intl";
import { type FetchMoreProps, type RelayToFlat, type SearchPageProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getStaffErrorMessage from "@dashboard/utils/errors/staff";
import { Box, Input, type Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getDefaultInvitePermissionGroups } from "./getDefaultInvitePermissionGroups";
import { staffAddMemberDialogMessages as messages } from "./messages";

export interface AddMemberFormData {
  email: string;
  firstName: string;
  lastName: string;
  permissionGroups: Option[];
}

interface StaffAddMemberDialogProps extends SearchPageProps {
  availablePermissionGroups: RelayToFlat<SearchPermissionGroupsQuery["search"]>;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: StaffErrorFragment[];
  fetchMorePermissionGroups: FetchMoreProps;
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AddMemberFormData) => SubmitPromise;
}

export const StaffAddMemberDialog = ({
  availablePermissionGroups,
  confirmButtonState,
  disabled,
  errors,
  fetchMorePermissionGroups,
  initialSearch,
  onClose,
  onConfirm,
  onSearchChange,
  open,
}: StaffAddMemberDialogProps): JSX.Element => {
  const dialogErrors = useModalDialogErrors(errors, open);
  const intl = useIntl();
  const formErrors = getFormErrors(["firstName", "lastName", "email"], dialogErrors);
  const isSubmitting = confirmButtonState === "loading";
  const isActionsDisabled = disabled || isSubmitting;
  const [prevOpen, setPrevOpen] = useState(open);
  const [formSession, setFormSession] = useState(0);
  const [initialForm, setInitialForm] = useState<AddMemberFormData>(() => ({
    email: "",
    firstName: "",
    lastName: "",
    permissionGroups: getDefaultInvitePermissionGroups(availablePermissionGroups),
  }));

  // Remount/reset the form when the dialog opens, seeding Full Access if available.
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setFormSession(session => session + 1);
      setInitialForm({
        email: "",
        firstName: "",
        lastName: "",
        permissionGroups: getDefaultInvitePermissionGroups(availablePermissionGroups),
      });
    }
  }

  const fieldErrorMessage = (field: "firstName" | "lastName" | "email"): string | undefined =>
    formErrors[field] ? getStaffErrorMessage(formErrors[field], intl) : undefined;

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        <Form
          key={formSession}
          data-test-id="invite-staff-member-dialog-form"
          initial={initialForm}
          onSubmit={onConfirm}
        >
          {({ change, data: formData, submit }) => {
            const canSubmit =
              !!formData.email.trim() && formData.permissionGroups.length > 0 && !isActionsDisabled;

            return (
              <DashboardModal.Content size="sm">
                <DashboardModal.ContextHeader
                  description={<FormattedMessage {...messages.description} />}
                >
                  <FormattedMessage {...messages.title} />
                </DashboardModal.ContextHeader>

                <DashboardModal.Body>
                  <DashboardModal.Inset>
                    <Box display="flex" flexDirection="column" gap={4}>
                      <Box display="flex" gap={3}>
                        <Input
                          autoFocus
                          data-test-id="first-name-input"
                          disabled={isActionsDisabled}
                          error={!!formErrors.firstName}
                          helperText={fieldErrorMessage("firstName")}
                          label={intl.formatMessage(commonMessages.firstName)}
                          name="firstName"
                          onChange={change}
                          type="text"
                          value={formData.firstName}
                          width="100%"
                        />
                        <Input
                          data-test-id="last-name-input"
                          disabled={isActionsDisabled}
                          error={!!formErrors.lastName}
                          helperText={fieldErrorMessage("lastName")}
                          label={intl.formatMessage(commonMessages.lastName)}
                          name="lastName"
                          onChange={change}
                          type="text"
                          value={formData.lastName}
                          width="100%"
                        />
                      </Box>

                      <Input
                        data-test-id="email-input"
                        disabled={isActionsDisabled}
                        error={!!formErrors.email}
                        helperText={fieldErrorMessage("email")}
                        label={intl.formatMessage(commonMessages.email)}
                        name="email"
                        onChange={change}
                        type="email"
                        value={formData.email}
                        width="100%"
                      />

                      <AccountPermissionGroups
                        availablePermissionGroups={availablePermissionGroups}
                        disabled={isActionsDisabled}
                        errors={dialogErrors}
                        formData={formData}
                        initialSearch={initialSearch}
                        onChange={change}
                        onSearchChange={onSearchChange}
                        {...fetchMorePermissionGroups}
                      />
                    </Box>
                  </DashboardModal.Inset>
                </DashboardModal.Body>

                <DashboardModal.Actions>
                  <BackButton disabled={isActionsDisabled} onClick={handleClose} />
                  <ConfirmButton
                    data-test-id="submit"
                    disabled={!canSubmit}
                    onClick={submit}
                    transitionState={confirmButtonState}
                  >
                    <FormattedMessage {...messages.sendInvite} />
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

StaffAddMemberDialog.displayName = "StaffAddMemberDialog";
