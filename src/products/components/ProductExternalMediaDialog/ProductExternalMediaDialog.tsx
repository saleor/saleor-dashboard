import Form from "@dashboard/components/Form";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "@dashboard/components/Modal";
import { ProductFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
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
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content __width={DASHBOARD_MODAL_WIDTH}>
        <Form initial={initialValues} onSubmit={handleOnSubmit}>
          {({ change, data, submit }) => (
            <Box display="grid" gap={6}>
              <DashboardModal.Title>
                <Text size={5} fontWeight="bold">
                  {intl.formatMessage(messages.buttonMessage)}
                </Text>
              </DashboardModal.Title>

              <Text size={2}>
                <FormattedMessage
                  id="zDvDnG"
                  defaultMessage="Media from the URL you supply will be shown in the media gallery. You will be able to define the order of the gallery."
                  description="modal header"
                />
              </Text>

              <Input
                label="URL"
                value={data.mediaUrl}
                name="mediaUrl"
                type="text"
                onChange={change}
                autoFocus
                size="medium"
              />

              <DashboardModal.Actions>
                <Button variant="secondary" onClick={onClose}>
                  <FormattedMessage {...buttonMessages.back} />
                </Button>
                <Button onClick={submit}>{intl.formatMessage(messages.buttonMessage)}</Button>
              </DashboardModal.Actions>
            </Box>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default ProductExternalMediaDialog;
