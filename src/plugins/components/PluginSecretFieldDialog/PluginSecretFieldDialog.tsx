import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Skeleton from "@saleor/components/Skeleton";
import { PluginConfigurationFragment_configuration } from "@saleor/fragments/types/PluginConfigurationFragment";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { DialogProps } from "@saleor/types";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PluginSecretFieldDialogFormData {
  value: string;
}
export interface PluginSecretFieldDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  field: PluginConfigurationFragment_configuration;
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
                multiline={
                  field?.type === ConfigurationTypeFieldEnum.SECRETMULTILINE
                }
                autoComplete="off"
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
