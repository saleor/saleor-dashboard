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
import Skeleton from "@saleor/components/Skeleton";
import {
  ConfigurationItemFragment,
  ConfigurationTypeFieldEnum,
} from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import { DialogProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PluginSecretFieldDialogFormData {
  value: string;
}
export interface PluginSecretFieldDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  field: ConfigurationItemFragment;
  onConfirm: (data: PluginSecretFieldDialogFormData) => void;
}

const PluginSecretFieldDialog: React.FC<PluginSecretFieldDialogProps> = ({
  confirmButtonState,
  field,
  onClose,
  onConfirm,
  open,
}) => {
  const intl = useIntl();

  const initialForm: PluginSecretFieldDialogFormData = {
    value: "",
  };

  return (
    <Dialog fullWidth onClose={onClose} open={open} maxWidth="sm">
      <DialogTitle>
        {field ? (
          field.value === null ? (
            intl.formatMessage({
              id: "qCH2eZ",
              defaultMessage: "Add Value to Authorization Field",
              description: "header",
            })
          ) : (
            intl.formatMessage({
              id: "Xy2T+y",
              defaultMessage: "Edit Authorization Field",
              description: "header",
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
              <BackButton onClick={onClose} />
              <ConfirmButton
                transitionState={confirmButtonState}
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
