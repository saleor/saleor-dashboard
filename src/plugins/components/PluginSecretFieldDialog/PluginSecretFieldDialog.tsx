import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "@dashboard/components/Modal";
import { ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { DialogProps } from "@dashboard/types";
import { TextField } from "@material-ui/core";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
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
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content __maxWidth={DASHBOARD_MODAL_WIDTH} width="100%" overflowX="hidden">
        <Form initial={initialForm} onSubmit={onConfirm}>
          {({ change, data, submit }) => (
            <Box display="grid" gap={6}>
              <DashboardModal.Title>
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
              </DashboardModal.Title>

              <TextField
                multiline={field?.type === ConfigurationTypeFieldEnum.SECRETMULTILINE}
                autoComplete="off"
                fullWidth
                label={field && field.label}
                name="value"
                type={
                  maybe(() => field.type) === ConfigurationTypeFieldEnum.PASSWORD
                    ? "password"
                    : "text"
                }
                value={data.value || ""}
                onChange={change}
              />

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton transitionState={confirmButtonState} onClick={submit}>
                  <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </Box>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

PluginSecretFieldDialog.displayName = "PluginSecretFieldDialog";
export default PluginSecretFieldDialog;
