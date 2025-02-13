import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  OrderLineWithMetadataFragment,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { ORDER_LINE_METADATA_UPDATE_FORM_ID } from "@dashboard/orders/views/OrderDetails/consts";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Box, Button, Divider, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  data?: OrderLineWithMetadataFragment;
  loading?: boolean;
}

type FormData = MetadataFormData;

export const OrderMetadataDialog = ({ onClose, open, data, loading }: OrderMetadataDialogProps) => {
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const hasManageProducts = useHasManageProductsPermission();

  const form = useForm(
    {
      metadata: data?.metadata ?? [],
      privateMetadata: data?.privateMetadata,
    },
    undefined,
    { confirmLeave: true, formId: ORDER_LINE_METADATA_UPDATE_FORM_ID },
  );

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId: ORDER_LINE_METADATA_UPDATE_FORM_ID,
  });
  const handleSubmit = createMetadataUpdateHandler(
    data,
    () => Promise.resolve([]),
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const submit = () => handleSubmit(form.data);

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const onChange = makeMetadataChangeHandler(form.change);

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.Header paddingX={6}>
          <FormattedMessage {...commonMessages.metadata} />: {data?.productName ?? ""}
        </DashboardModal.Header>

        <Box display="flex" flexDirection="column" gap={5}>
          <Box
            display="flex"
            flexDirection="column"
            __marginBottom="calc(var(--mu-spacing-10) * -1)" // remove Metadata padding
          >
            <Box display="flex" flexDirection="column" marginLeft={6} gap={2}>
              <Text as="h2" size={5} fontWeight="bold">
                <FormattedMessage
                  defaultMessage="Order line metadata"
                  description="modal header, editing order line metadata"
                  id="ui7jMt"
                />
              </Text>
              <Text>
                <FormattedMessage
                  defaultMessage="Represents the metadata of the given ordered item"
                  description="modal subheader, editing order line metadata"
                  id="y+CqSF"
                />
              </Text>
            </Box>

            <Metadata onChange={onChange} isLoading={loading} data={form.data} />
          </Box>

          <Divider />

          <Box
            display="flex"
            flexDirection="column"
            __marginBottom="calc(var(--mu-spacing-10) * -1)" // Remove Metadata padding
          >
            <Box display="flex" flexDirection="column" marginLeft={6} gap={2}>
              <Text as="h2" size={5} fontWeight="bold">
                <FormattedMessage
                  defaultMessage="Product variant metadata"
                  description="modal header, read-only product variant metadata"
                  id="PH4R7g"
                />
              </Text>
              <Text>
                <FormattedMessage
                  defaultMessage="This is a metadata of the variant that is being used in this ordered item"
                  description="modal subheader, read-only product variant metadata"
                  id="/mwSjm"
                />
              </Text>
            </Box>

            <Metadata
              readonly={true}
              onChange={() => undefined}
              isLoading={loading}
              data={{
                metadata: data?.variant?.metadata ?? [],
                privateMetadata: data?.variant?.privateMetadata,
              }}
              hidePrivateMetadata={!hasManageProducts}
            />
          </Box>
        </Box>
        <DashboardModal.Actions paddingX={6}>
          <Button data-test-id="save" variant="primary" onClick={submit}>
            <FormattedMessage {...buttonMessages.save} />
          </Button>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
