import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { MenuErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
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
  name: "",
};

const MenuCreateDialog: React.FC<MenuCreateDialogProps> = ({
  confirmButtonState,
  disabled,
  errors,
  onClose,
  onConfirm,
  open,
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

  return (
    <Dialog onClose={onClose} maxWidth="sm" fullWidth open={open}>
      <DialogTitle disableTypography data-test-id="create-menu-dialog-title">
        <FormattedMessage
          id="0OtaXa"
          defaultMessage="Create Menu"
          description="dialog header"
        />
      </DialogTitle>
      <Form initial={initialForm} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <TextField
                data-test-id="menu-name-input"
                disabled={disabled}
                error={!!formErrors.name}
                fullWidth
                helperText={getMenuErrorMessage(formErrors.name, intl)}
                label={intl.formatMessage({
                  id: "jhh/D6",
                  defaultMessage: "Menu Title",
                })}
                name={"name" as keyof MenuCreateDialogFormData}
                value={data.name}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                transitionState={confirmButtonState}
                onClick={submit}
                data-test-id="submit"
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
