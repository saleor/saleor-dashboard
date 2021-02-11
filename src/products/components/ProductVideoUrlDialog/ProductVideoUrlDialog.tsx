import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { buttonMessages } from "@saleor/intl";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

interface ProductVideoUrlDialogProps {
  product: ProductDetails_product;
  open: boolean;
  onClose: () => void;
  onSubmit: (videoUrl: string) => void;
}

interface FormValues {
  videoUrl: string;
}

const messages = defineMessages({
  buttonMessage: {
    defaultMessage: "Upload video URL",
    description: "modal button"
  },
  uploadVideoUrl: {
    defaultMessage: "Upload Video URL",
    description: "dialog header"
  }
});

const ProductVideoUrlDialog: React.FC<ProductVideoUrlDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const intl = useIntl();
  const initialValues: FormValues = {
    videoUrl: ""
  };

  const handleOnSubmit = (values: FormValues) => {
    onSubmit(values.videoUrl);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{intl.formatMessage(messages.uploadVideoUrl)}</DialogTitle>
      <Form initial={initialValues} onSubmit={handleOnSubmit}>
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

export default ProductVideoUrlDialog;
