import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { buttonMessages } from "@saleor/intl";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface ProductVideoUrlDialogProps {
  product: ProductDetails_product;
  open: boolean;
  errors: ProductErrorFragment[];
  onClose();
  onSubmit(videoUrl: string);
}

interface FormValues {
  videoUrl: string;
}

const ProductVideoUrlDialog: React.FC<ProductVideoUrlDialogProps> = props => {
  const intl = useIntl();
  const { errors, open, onClose, onSubmit } = props;
  const initialValues: FormValues = {
    videoUrl: ""
  };

  let errorMessage;
  if (errors?.length) {
    const err = errors[0].code;
    if (err === ProductErrorCode.INVALID) {
      errorMessage = intl.formatMessage(commonErrorMessages.invalid);
    } else {
      errorMessage = intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Upload Video URL"
          description="dialog header"
        />
      </DialogTitle>
      <Form
        initial={initialValues}
        onSubmit={values => onSubmit(values.videoUrl)}
      >
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
                error={!!errorMessage}
                helperText={errorMessage}
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
