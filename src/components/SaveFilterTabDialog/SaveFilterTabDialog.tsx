import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import ConfirmButton from "../ConfirmButton";
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
  const handleErrors = data => {
    if (data.name.length) {
      onSubmit(data);
      setErrors(false);
    } else {
      setErrors(true);
    }
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <FormattedMessage
          id="liLrVs"
          defaultMessage="Save Custom Search"
          description="save filter tab, header"
        />
      </DialogTitle>
      <Form initial={initialForm} onSubmit={handleErrors}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                label={intl.formatMessage({
                  id: "QcIFCs",
                  defaultMessage: "Search Name",
                  description: "save search tab",
                })}
                name={"name" as keyof SaveFilterTabDialogFormData}
                value={data.name}
                onChange={change}
                error={errors}
                helperText={errors ? "This field is required" : null}
              />
            </DialogContent>
            <DialogActions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                transitionState={confirmButtonState}
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
SaveFilterTabDialog.displayName = "SaveFilterTabDialog";
export default SaveFilterTabDialog;
