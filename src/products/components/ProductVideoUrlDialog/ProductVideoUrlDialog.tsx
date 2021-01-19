import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";
import Typography from "@material-ui/core/Typography";

import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";

interface ProductVideoUrlDialogProps {
  open: boolean;
  onClose();
}

interface FormData {
  videoUrl: string;
}

const ProductVideoUrlDialog: React.FC<ProductVideoUrlDialogProps> = props => {
  const { open, onClose } = props;
  const [disabled, setDisabled] = React.useState(false);
  const handleOnSubmit = (data: FormData) => {
    setDisabled(true);
    console.log(data);
    setDisabled(false);
    onClose();
  };
  const initialFormData: FormData = {
    videoUrl: ""
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Upload Video URL"
          description="dialog header"
        />
      </DialogTitle>
      <Form initial={initialFormData} onSubmit={handleOnSubmit}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <Typography>
                <FormattedMessage
                  defaultMessage="Video you supply will be shown in media gallery. You will be able to define the order of gallery."
                  description="modal header"
                />
              </Typography>
              <FormSpacer />
              <TextField
                disabled={disabled}
                label="Video URL"
                value={data.videoUrl}
                name="videoUrl"
                type="url"
                onChange={change}
                autoFocus
                fullWidth
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <Button onClick={submit} disabled={disabled}>
                <FormattedMessage {...buttonMessages.uploadVideo} />
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export default ProductVideoUrlDialog;
