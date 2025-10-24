import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderLinesMetadataQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Box, Button, Divider, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { NestedMetadataHookForm } from "./NestedMetadataHookForm";
import { OrderLineDetails } from "./OrderLineDetails/OrderLineDetails";
import { TEST_ID_ORDER_LINE_METADATA, TEST_ID_PRODUCT_VARIANT_METADATA } from "./test-ids";
import { useHandleOrderLineMetadataSubmit } from "./useHandleSubmit";
import { useMetadataValues } from "./useMetadataValues";

export type OrderMetadataDialogData = NonNullable<OrderLinesMetadataQuery["order"]>["lines"][0];

export interface OrderAndVariantMetadataFormData {
  orderLine: MetadataFormData;
  variant: MetadataFormData;
}

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  lineId: string;
  orderId: string;
}

export const OrderMetadataDialog = ({
  onClose,
  open,
  lineId,
  orderId,
}: OrderMetadataDialogProps) => {
  const { data, loading } = useMetadataValues({ orderId, lineId, open });
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleOrderLineMetadataSubmit({
    initialData: data,
    onClose,
  });
  const hasManageProducts = useHasManageProductsPermission();

  const formMethods = useForm<OrderAndVariantMetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values: submitInProgress
      ? lastSubmittedData
      : {
          // Removes __typename from metadata item object
          orderLine: {
            metadata: (data?.metadata ?? []).map(mapMetadataItemToInput),
            privateMetadata: (data?.privateMetadata ?? [])?.map(mapMetadataItemToInput),
          },
          variant: {
            metadata: (data?.variant?.metadata ?? []).map(mapMetadataItemToInput),
            privateMetadata: (data?.variant?.privateMetadata ?? [])?.map(mapMetadataItemToInput),
          },
        },
  });

  const { handleSubmit, control, getValues, formState, trigger, reset } = formMethods;

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md" overflowY="hidden">
        <DashboardModal.Header>
          <OrderLineDetails data={data} loading={loading} />
        </DashboardModal.Header>

        {/* This is scroll container so that Save and title are always visible */}
        <Box
          style={{
            // Max height calculated so that there's no scroll on modal itself
            maxHeight: "calc(-320px + 100vh)",
            // Remove right margin (DashboardModal.Content has 6 units padding)
            // It has to be removed to avoid spacing out horizontal scroll in weird way
            marginRight: "calc(var(--mu-spacing-6) * -1)",
          }}
          // Re-add back removed padding via negative marginRight
          paddingRight={6}
          overflowY="auto"
        >
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={5}>
              <Box display="flex" flexDirection="column" data-test-id={TEST_ID_ORDER_LINE_METADATA}>
                <Box display="flex" flexDirection="column" marginLeft={6} gap={2}>
                  <Text as="h2" size={5} fontWeight="bold">
                    <FormattedMessage
                      defaultMessage="Order line metadata"
                      description="dialog, editing order line metadata"
                      id="B54f/g"
                    />
                  </Text>
                  <Text>
                    <FormattedMessage
                      defaultMessage="Represents the metadata of the given ordered item"
                      description="dialog , editing order line metadata"
                      id="7WrRzs"
                    />
                  </Text>
                </Box>

                <NestedMetadataHookForm
                  isLoading={loading && !data}
                  disabled={loading || submitInProgress}
                  control={control}
                  getValues={getValues}
                  trigger={trigger}
                  formErrors={formState.errors}
                  fieldPrefix="orderLine"
                />
              </Box>
              <Divider />

              <Box
                display="flex"
                flexDirection="column"
                data-test-id={TEST_ID_PRODUCT_VARIANT_METADATA}
              >
                <Box display="flex" flexDirection="column" marginLeft={6} gap={2}>
                  <Text as="h2" size={5} fontWeight="bold">
                    <FormattedMessage
                      defaultMessage="Product variant metadata"
                      description="modal header, editable product variant metadata"
                      id="hQDWIw"
                    />
                  </Text>
                  <Text>
                    <FormattedMessage
                      defaultMessage="This is a metadata of the variant that is being used in this ordered item"
                      description="modal subheader, editable product variant metadata"
                      id="tquei9"
                    />
                  </Text>
                </Box>

                <NestedMetadataHookForm
                  isLoading={loading && !data}
                  disabled={loading || submitInProgress || !hasManageProducts}
                  control={control}
                  getValues={getValues}
                  trigger={trigger}
                  formErrors={formState.errors}
                  fieldPrefix="variant"
                  hidePrivateMetadata={!hasManageProducts}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <DashboardModal.Actions
          paddingTop={4}
          paddingX={6}
          bottom={6}
          width="100%"
          backgroundColor="default1"
        >
          <ButtonWithLoader
            transitionState={submitInProgress ? "loading" : "default"}
            data-test-id="save"
            variant="primary"
            disabled={submitInProgress || !formState.isDirty}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ButtonWithLoader>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
