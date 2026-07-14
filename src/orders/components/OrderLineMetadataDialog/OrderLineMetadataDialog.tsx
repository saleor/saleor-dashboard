import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import ExitFormDialog from "@dashboard/components/Form/ExitFormDialog";
import { type MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { MetadataLoadingCard } from "@dashboard/components/Metadata/MetadataLoadingCard";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModalDivider } from "@dashboard/components/Modal/ModalDivider";
import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import { type OrderLinesMetadataQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { OrderLineDetails } from "./OrderLineDetails/OrderLineDetails";
import { TEST_ID_ORDER_LINE_METADATA, TEST_ID_PRODUCT_VARIANT_METADATA } from "./test-ids";
import { useHandleOrderLineMetadataSubmit } from "./useHandleSubmit";
import { useMetadataValues } from "./useMetadataValues";
import { useOrderLineMetadataFormControls } from "./useOrderLineMetadataFormControls";
import { mapFieldArrayToMetadataInput } from "./utils";

export type OrderLineMetadataDialogData = NonNullable<OrderLinesMetadataQuery["order"]>["lines"][0];

export interface OrderLineAndVariantMetadataFormData {
  orderLine: MetadataFormData;
  variant: MetadataFormData;
}

interface OrderLineMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  lineId: string;
  orderId: string;
}

const ORDER_LINE_METADATA_FORM_ID = "order-line-metadata-form";

export const OrderLineMetadataDialog = ({
  onClose,
  open,
  lineId,
  orderId,
}: OrderLineMetadataDialogProps) => {
  const { data, loading } = useMetadataValues({ orderId, lineId, open });
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleOrderLineMetadataSubmit({
    initialData: data,
    onClose,
  });
  const hasManageProducts = useHasManageProductsPermission();

  const formMethods = useForm<OrderLineAndVariantMetadataFormData>({
    values: submitInProgress
      ? lastSubmittedData
      : {
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

  const {
    orderLineMetadataFields,
    orderLinePrivateMetadataFields,
    variantMetadataFields,
    variantPrivateMetadataFields,
    handleOrderLineMetadataChange,
    handleOrderLinePrivateMetadataChange,
    handleVariantMetadataChange,
    handleVariantPrivateMetadataChange,
    orderLineMetadataErrors,
    orderLinePrivateMetadataErrors,
  } = useOrderLineMetadataFormControls({ control, trigger, getValues, formState });

  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleClose = () => {
    if (formState.isDirty) {
      setShowExitDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowExitDialog(false);
    onClose();
  };

  useEffect(
    function resetMetadataFormWhenDialogCloses() {
      if (!open) {
        reset();
      }
    },
    [open, reset],
  );

  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.ContextHeader
          description={<OrderLineDetails data={data} loading={loading} />}
          wrapDescription={false}
        >
          <FormattedMessage
            defaultMessage="Order line metadata"
            id="QSTD5z"
            description="dialog title for order line metadata"
          />
        </DashboardModal.ContextHeader>

        <DashboardModal.Body>
          <Box
            as="form"
            id={ORDER_LINE_METADATA_FORM_ID}
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
          >
            <DashboardModal.Inset>
              <Box display="flex" flexDirection="column" data-test-id={TEST_ID_ORDER_LINE_METADATA}>
                <Text size={2} color="default2">
                  <FormattedMessage
                    defaultMessage="Metadata stored on this order line only. Changes here do not update the product variant."
                    description="scope helper for editable order line metadata section"
                    id="2m2Xi9"
                  />
                </Text>

                {loading && !data ? (
                  <>
                    <MetadataLoadingCard inModal marginTop={4} />
                    <MetadataLoadingCard isPrivate inModal />
                  </>
                ) : (
                  <>
                    <MetadataCard
                      inModal
                      marginTop={4}
                      data={mapFieldArrayToMetadataInput(orderLineMetadataFields)}
                      isPrivate={false}
                      disabled={loading || submitInProgress}
                      onChange={handleOrderLineMetadataChange}
                      error={
                        orderLineMetadataErrors.length
                          ? orderLineMetadataErrors.join(", ")
                          : undefined
                      }
                    />

                    <MetadataCard
                      inModal
                      data={mapFieldArrayToMetadataInput(orderLinePrivateMetadataFields)}
                      isPrivate={true}
                      disabled={loading || submitInProgress}
                      onChange={handleOrderLinePrivateMetadataChange}
                      error={
                        orderLinePrivateMetadataErrors.length
                          ? orderLinePrivateMetadataErrors.join(", ")
                          : undefined
                      }
                    />
                  </>
                )}
              </Box>
            </DashboardModal.Inset>

            <ModalDivider />

            <DashboardModal.Inset>
              <Box
                display="flex"
                flexDirection="column"
                data-test-id={TEST_ID_PRODUCT_VARIANT_METADATA}
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  <ModalSectionHeader>
                    <FormattedMessage
                      defaultMessage="Product variant metadata"
                      description="modal header, editable product variant metadata"
                      id="hQDWIw"
                    />
                  </ModalSectionHeader>
                  <Text size={2} color="default2">
                    <FormattedMessage
                      defaultMessage="The read-only metadata of the actual variant used in this order. {link}"
                      description="info about variant metadata with link to edit"
                      id="00d8GP"
                      values={{
                        link: data?.variant?.id ? (
                          <MicrocopyLink to={productVariantEditUrl(data.variant.id)}>
                            <FormattedMessage
                              defaultMessage="Edit on variant page"
                              description="link to edit variant metadata"
                              id="tf+OkY"
                            />
                          </MicrocopyLink>
                        ) : null,
                      }}
                    />
                  </Text>
                </Box>

                {loading && !data ? (
                  <>
                    <MetadataLoadingCard inModal marginTop={4} />
                    {!hasManageProducts ? null : <MetadataLoadingCard isPrivate inModal />}
                  </>
                ) : (
                  <>
                    <MetadataCard
                      inModal
                      marginTop={4}
                      data={mapFieldArrayToMetadataInput(variantMetadataFields)}
                      isPrivate={false}
                      readonly={true}
                      defaultExpanded={false}
                      onChange={handleVariantMetadataChange}
                    />

                    {hasManageProducts && (
                      <MetadataCard
                        inModal
                        data={mapFieldArrayToMetadataInput(variantPrivateMetadataFields)}
                        isPrivate={true}
                        readonly={true}
                        defaultExpanded={false}
                        onChange={handleVariantPrivateMetadataChange}
                      />
                    )}
                  </>
                )}
              </Box>
            </DashboardModal.Inset>
          </Box>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <Button data-test-id="back" variant="secondary" onClick={handleClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
          <ButtonWithLoader
            transitionState={submitInProgress ? "loading" : "default"}
            data-test-id="save"
            variant="primary"
            disabled={submitInProgress || !formState.isDirty}
            type="submit"
            form={ORDER_LINE_METADATA_FORM_ID}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ButtonWithLoader>
        </DashboardModal.Actions>
      </DashboardModal.Content>

      <ExitFormDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onLeave={handleConfirmClose}
      />
    </DashboardModal>
  );
};
