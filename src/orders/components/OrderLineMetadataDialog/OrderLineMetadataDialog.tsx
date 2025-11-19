import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { MetadataLoadingCard } from "@dashboard/components/Metadata/MetadataLoadingCard";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderLinesMetadataQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Box, Button, Divider, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
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
    variantMetadataErrors,
    variantPrivateMetadataErrors,
  } = useOrderLineMetadataFormControls({ control, trigger, getValues, formState });

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

                {loading && !data ? (
                  <Box display="grid" gap={2}>
                    <MetadataLoadingCard />
                    <MetadataLoadingCard isPrivate />
                  </Box>
                ) : (
                  <Box display="grid" gap={2}>
                    <MetadataCard
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
                  </Box>
                )}
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

                {loading && !data ? (
                  <Box display="grid" gap={2}>
                    <MetadataLoadingCard />
                    {!hasManageProducts ? null : <MetadataLoadingCard isPrivate />}
                  </Box>
                ) : (
                  <Box display="grid" gap={2}>
                    <MetadataCard
                      data={mapFieldArrayToMetadataInput(variantMetadataFields)}
                      isPrivate={false}
                      disabled={loading || submitInProgress || !hasManageProducts}
                      onChange={handleVariantMetadataChange}
                      error={
                        variantMetadataErrors.length ? variantMetadataErrors.join(", ") : undefined
                      }
                    />

                    {hasManageProducts && (
                      <MetadataCard
                        data={mapFieldArrayToMetadataInput(variantPrivateMetadataFields)}
                        isPrivate={true}
                        disabled={loading || submitInProgress || !hasManageProducts}
                        onChange={handleVariantPrivateMetadataChange}
                        error={
                          variantPrivateMetadataErrors.length
                            ? variantPrivateMetadataErrors.join(", ")
                            : undefined
                        }
                      />
                    )}
                  </Box>
                )}
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
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
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
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
