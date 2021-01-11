import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { MenuErrorFragment } from "@saleor/fragments/types/MenuErrorFragment";
import { buttonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getMenuErrorMessage from "@saleor/utils/errors/menu";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface MenuCreateDialogFormData {
  name: string;
}

export interface MenuCreateDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: MenuErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: MenuCreateDialogFormData) => void;
}

const initialForm: MenuCreateDialogFormData = {
  name: ""
};

const MenuCreateDialog: React.FC<MenuCreateDialogProps> = ({
  confirmButtonState,
  disabled,
  errors,
  onClose,
  onConfirm,
  open
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

  return (
    <Dialog onClose={onClose} maxWidth="sm" fullWidth open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Create Menu"
          description="dialog header"
          id="menuCreateDialogHeader"
        />
      </DialogTitle>
      <Form initial={initialForm} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <TextField
                disabled={disabled}
                error={!!formErrors.name}
                fullWidth
                helperText={getMenuErrorMessage(formErrors.name, intl)}
                label={intl.formatMessage({
                  defaultMessage: "Menu Title",
                  id: "menuCreateDialogMenuTitleLabel"
                })}
                name={"name" as keyof MenuCreateDialogFormData}
                value={data.name}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                transitionState={confirmButtonState}
                color="primary"
                variant="contained"
                onClick={submit}
              >
                <FormattedMessage {...buttonMessages.save} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

MenuCreateDialog.displayName = "MenuCreateDialog";
export default MenuCreateDialog;
