import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import {
  SearchPermissionGroupsQuery,
  StaffErrorFragment,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@saleor/types";
import { getFormErrors } from "@saleor/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
      backgroundColor: "#eaeaea",
      border: "none",
      height: 1,
      marginBottom: 0,
    },
    sectionTitle: {
      fontWeight: 600 as 600,
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
  const formErrors = getFormErrors(
    ["firstName", "lastName", "email"],
    dialogErrors,
  );

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
            <DialogTitle>
              <FormattedMessage
                id="23g7PY"
                defaultMessage="Invite Staff Member"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <div className={classes.textFieldGrid}>
                <TextField
                  {...getFieldProps("firstName")}
                  type="text"
                  value={formData.firstName}
                  onChange={change}
                />
                <TextField
                  {...getFieldProps("lastName")}
                  type="text"
                  value={formData.lastName}
                  onChange={change}
                />
              </div>
              <FormSpacer />
              <TextField
                fullWidth
                {...getFieldProps("email")}
                type="email"
                value={formData.email}
                onChange={change}
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
                <FormattedMessage
                  id="hw9Fah"
                  defaultMessage="Send invite"
                  description="button"
                />
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
