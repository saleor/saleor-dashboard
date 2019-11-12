import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Skeleton from "@saleor/components/Skeleton";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { Plugin_plugin_configuration } from "@saleor/plugins/types/Plugin";
import { DialogProps } from "@saleor/types";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";

export interface PluginSecretFieldDialogFormData {
  value: string;
}
export interface PluginSecretFieldDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  field: Plugin_plugin_configuration;
  onConfirm: (data: PluginSecretFieldDialogFormData) => void;
}

const PluginSecretFieldDialog: React.FC<PluginSecretFieldDialogProps> = ({
  confirmButtonState,
  field,
  onClose,
  onConfirm,
  open
}) => {
  const intl = useIntl();

  const initialForm: PluginSecretFieldDialogFormData = {
    value: ""
  };

  return (
    <Dialog fullWidth onClose={onClose} open={open} maxWidth="sm">
      <DialogTitle>
        {field ? (
          field.value === null ? (
            intl.formatMessage({
              defaultMessage: "Add Value to Authorization Field",
              description: "header"
            })
          ) : (
            intl.formatMessage({
              defaultMessage: "Edit Authorization Field",
              description: "header"
            })
          )
        ) : (
          <Skeleton />
        )}
      </DialogTitle>
      <Form initial={initialForm} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <TextField
                fullWidth
                label={field && field.label}
                name="value"
                type={
                  maybe(() => field.type) ===
                    ConfigurationTypeFieldEnum.PASSWORD && "password"
                }
                value={data.value || ""}
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
                <FormattedMessage {...buttonMessages.confirm} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

PluginSecretFieldDialog.displayName = "PluginSecretFieldDialog";
export default PluginSecretFieldDialog;
