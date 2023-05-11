import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { ProductFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Button, Input, Text } from "@saleor/macaw-ui/next";
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
      <DialogTitle disableTypography>
        <Text variant="heading">
          {intl.formatMessage(messages.buttonMessage)}
        </Text>
      </DialogTitle>
      <Form initial={initialValues} onSubmit={handleOnSubmit}>
        {({ change, data, submit }) => (
          <>
            <DialogContent>
              <Text variant="caption">
                <FormattedMessage
                  id="zDvDnG"
                  defaultMessage="Media from the URL you supply will be shown in the media gallery. You will be able to define the order of the gallery."
                  description="modal header"
                />
              </Text>
              <FormSpacer />
              <Input
                label="URL"
                value={data.mediaUrl}
                name="mediaUrl"
                type="text"
                onChange={change}
                autoFocus
                size="medium"
              />
            </DialogContent>

            <DialogActions>
              <Button variant="secondary" onClick={onClose}>
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

export default ProductExternalMediaDialog;
