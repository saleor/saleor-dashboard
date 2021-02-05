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
import { FormattedMessage } from "react-intl";

interface ProductVideoUrlDialogProps {
  product: ProductDetails_product;
  open: boolean;
  onClose();
  onSubmit(videoUrl: string);
}

interface FormValues {
  videoUrl: string;
}

const ProductVideoUrlDialog: React.FC<ProductVideoUrlDialogProps> = props => {
  const { open, onClose, onSubmit } = props;
  const initialValues: FormValues = {
    videoUrl: ""
  };

  const handleOnSubmit = values => {
    onSubmit(values.videoUrl);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Upload Video URL"
          description="dialog header"
        />
      </DialogTitle>
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
                <FormattedMessage
                  defaultMessage={"Upload video URL"}
                  description={"button"}
                />
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export default ProductVideoUrlDialog;
