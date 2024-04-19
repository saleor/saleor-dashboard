// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { SearchPermissionGroupsQuery, StaffErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
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
const useStyles = makeStyles(
  theme => ({
    hr: {
      backgroundColor: vars.colors.border.default1,
      border: "none",
      height: 1,
      marginBottom: 0,
    },
    sectionTitle: {
      fontWeight: 600 as const,
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(2),
    },
    textFieldGrid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr",
    },
  }),
  { name: "StaffAddMemberDialog" },
);

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
  const classes = useStyles(props);
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
    <Dialog onClose={onClose} open={open}>
      <Form initial={initialForm} onSubmit={onConfirm}>
        {({ change, data: formData }) => (
          <>
            <DialogTitle disableTypography>
              <FormattedMessage
                id="23g7PY"
                defaultMessage="Invite Staff Member"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <div className={classes.textFieldGrid}>
                <TextField
                  data-test-id="first-name-input"
                  {...getFieldProps("firstName")}
                  type="text"
                  value={formData.firstName}
                  onChange={change}
                />
                <TextField
                  data-test-id="last-name-input"
                  {...getFieldProps("lastName")}
                  type="text"
                  value={formData.lastName}
                  onChange={change}
                />
              </div>
              <FormSpacer />
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
            </DialogContent>
            <hr className={classes.hr} />
            <DialogActions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                data-test-id="submit"
                type="submit"
                transitionState={confirmButtonState}
              >
                <FormattedMessage id="hw9Fah" defaultMessage="Send invite" description="button" />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
StaffAddMemberDialog.displayName = "StaffAddMemberDialog";
export default StaffAddMemberDialog;
