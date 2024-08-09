// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { SearchPermissionGroupsQuery, StaffErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ExtendedFormHelperTextProps } from "./types";

export interface AddMemberFormData {
  email: string;
  firstName: string;
  lastName: string;
  permissionGroups: string[];
}

const initialForm: AddMemberFormData = {
  email: "",
  firstName: "",
  lastName: "",
  permissionGroups: [],
};

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

const StaffAddMemberDialog: React.FC<StaffAddMemberDialogProps> = props => {
  const { confirmButtonState, errors, onClose, onConfirm, open } = props;
  const dialogErrors = useModalDialogErrors(errors, open);
  const intl = useIntl();
  const formErrors = getFormErrors(["firstName", "lastName", "email"], dialogErrors);
  const getFieldProps = (name: string) => ({
    disabled: props.disabled,
    error: !!formErrors[name],
    helperText: formErrors[name]?.message,
    label: intl.formatMessage(commonMessages[name]),
    name,
  });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form
        data-test-id="invite-staff-member-dialog-form"
        initial={initialForm}
        onSubmit={onConfirm}
      >
        {({ change, data: formData, submit }) => (
          <DashboardModal.Content size="sm">
            <DashboardModal.Title>
              <FormattedMessage
                id="23g7PY"
                defaultMessage="Invite Staff Member"
                description="dialog header"
              />
            </DashboardModal.Title>

            <Box display="flex" gap={3} justifyContent="space-between">
              <TextField
                data-test-id="first-name-input"
                {...getFieldProps("firstName")}
                type="text"
                value={formData.firstName}
                onChange={change}
                fullWidth
              />
              <TextField
                data-test-id="last-name-input"
                {...getFieldProps("lastName")}
                type="text"
                value={formData.lastName}
                onChange={change}
                fullWidth
              />
            </Box>

            <TextField
              data-test-id="email-input"
              fullWidth
              {...getFieldProps("email")}
              type="email"
              value={formData.email}
              onChange={change}
              FormHelperTextProps={
                {
                  "data-test-id": "email-text-input-helper-text",
                } as ExtendedFormHelperTextProps
              }
            />

            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                data-test-id="submit"
                onClick={submit}
                transitionState={confirmButtonState}
              >
                <FormattedMessage id="hw9Fah" defaultMessage="Send invite" description="button" />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        )}
      </Form>
    </DashboardModal>
  );
};

StaffAddMemberDialog.displayName = "StaffAddMemberDialog";
export default StaffAddMemberDialog;
