import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { SingleAutocompleteSelectField } from "@saleor/components/SingleAutocompleteSelectField";
import { buttonMessages } from "@saleor/intl";

const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      overflowY: "visible"
    },
    root: {
      overflowY: "visible",
      width: theme.breakpoints.values.sm
    },
    select: {
      flex: 1,
      marginRight: theme.spacing.unit * 2
    },
    textRight: {
      textAlign: "right"
    }
  });

interface OrderCustomerEditDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  user: string;
  userDisplayValue: string;
  users?: Array<{
    id: string;
    email: string;
  }>;
  loading?: boolean;
  fetchUsers(value: string);
  onChange(event: React.ChangeEvent<any>);
  onClose?();
  onConfirm?(event: React.FormEvent<any>);
}

const OrderCustomerEditDialog = withStyles(styles, {
  name: "OrderCustomerEditDialog"
})(
  ({
    classes,
    confirmButtonState,
    open,
    loading,
    user,
    userDisplayValue,
    users,
    fetchUsers,
    onChange,
    onClose,
    onConfirm
  }: OrderCustomerEditDialogProps) => {
    const choices =
      !loading && users
        ? users.map(v => ({
            label: v.email,
            value: v.id
          }))
        : [];
    return (
      <Dialog onClose={onClose} open={open} classes={{ paper: classes.dialog }}>
        <DialogTitle>
          <FormattedMessage
            defaultMessage="Edit customer details"
            description="dialog header"
          />
        </DialogTitle>
        <DialogContent className={classes.root}>
          <SingleAutocompleteSelectField
            choices={choices}
            allowCustomValues
            loading={loading}
            displayValue={userDisplayValue}
            name="user"
            value={user}
            fetchChoices={fetchUsers}
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage {...buttonMessages.cancel} />
          </Button>
          <ConfirmButton
            transitionState={confirmButtonState}
            color="primary"
            variant="contained"
            onClick={onConfirm}
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DialogActions>
      </Dialog>
    );
  }
);
OrderCustomerEditDialog.displayName = "OrderCustomerEditDialog";
export default OrderCustomerEditDialog;
