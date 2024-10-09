import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { TextField } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { ConfirmButton } from "../ConfirmButton";
import Form from "../Form";

export interface SaveFilterTabDialogFormData {
  name: string;
}

const initialForm: SaveFilterTabDialogFormData = {
  name: "",
};

export interface SaveFilterTabDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SaveFilterTabDialogFormData) => void;
}

const SaveFilterTabDialog: React.FC<SaveFilterTabDialogProps> = ({
  confirmButtonState,
  onClose,
  onSubmit,
  open,
}) => {
  const intl = useIntl();
  const [errors, setErrors] = React.useState(false);
  const handleErrors = (data: SaveFilterTabDialogFormData) => {
    if (data.name.trim().length) {
      onSubmit(data);
      setErrors(false);
    } else {
      setErrors(true);
    }
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <Form initial={initialForm} onSubmit={handleErrors}>
          {({ change, data, submit }) => (
            <DashboardModal.Grid>
              <DashboardModal.Header>
                <FormattedMessage
                  id="P9YktI"
                  defaultMessage="Save view preset"
                  description="save preset, header"
                />
              </DashboardModal.Header>

              <TextField
                autoFocus
                fullWidth
                label={intl.formatMessage({
                  id: "zhnwl6",
                  defaultMessage: "Preset name",
                  description: "save preset name",
                })}
                name={"name" as keyof SaveFilterTabDialogFormData}
                value={data.name}
                onChange={change}
                error={errors}
                data-test-id="preset-name-text-field"
                helperText={errors ? "This field is required" : null}
              />

              <DashboardModal.Actions>
                <BackButton onClick={onClose} data-test-id="cancel-preset-button">
                  <FormattedMessage {...buttonMessages.cancel} />
                </BackButton>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  onClick={submit}
                  data-test-id="save-preset-button"
                >
                  <FormattedMessage {...buttonMessages.save} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Grid>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

SaveFilterTabDialog.displayName = "SaveFilterTabDialog";
export default SaveFilterTabDialog;
