import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import { Button } from "@saleor/components/Button";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { ProductFragment } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

interface ProductExternalMediaDialogProps {
  product: ProductFragment;
  open: boolean;
  onClose: () => void;
  onSubmit: (mediaUrl: string) => SubmitPromise;
}

interface FormValues {
  mediaUrl: string;
}

const messages = defineMessages({
  buttonMessage: {
    id: "4W/CKn",
    defaultMessage: "Upload URL",
    description: "modal button",
  },
});

const ProductExternalMediaDialog: React.FC<ProductExternalMediaDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const intl = useIntl();
  const initialValues: FormValues = {
    mediaUrl: "",
  };

  const handleOnSubmit = (values: FormValues) => {
    onSubmit(values.mediaUrl);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{intl.formatMessage(messages.buttonMessage)}</DialogTitle>
      <Form initial={initialValues} onSubmit={handleOnSubmit}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <Typography>
                <FormattedMessage
                  id="zDvDnG"
                  defaultMessage="Media from the URL you supply will be shown in the media gallery. You will be able to define the order of the gallery."
                  description="modal header"
                />
              </Typography>
              <FormSpacer />
              <TextField
                label="URL"
                value={data.mediaUrl}
                name="mediaUrl"
                type="url"
                onChange={change}
                autoFocus
                fullWidth
              />
            </DialogContent>

            <DialogActions>
              <BackButton onClick={onClose} />
              <Button onClick={submit}>
                {intl.formatMessage(messages.buttonMessage)}
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export default ProductExternalMediaDialog;
