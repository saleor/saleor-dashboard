import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataHookForm } from "@dashboard/components/MetadataHookForm";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderLineWithMetadataFragment } from "@dashboard/graphql";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Box, Button, Divider, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { TEST_ID_ORDER_LINE_METADATA, TEST_ID_PRODUCT_VARIANT_METADATA } from "./test-ids";
import { useHandleOrderLineMetadataSubmit } from "./useHandleSubmit";

type OrderLineMetadata = Pick<OrderLineWithMetadataFragment, "metadata" | "privateMetadata" | "id">;
type ProductVariantMetadata = Pick<
  NonNullable<OrderLineWithMetadataFragment["variant"]>,
  "metadata" | "privateMetadata" | "id"
>;

export type OrderMetadataDialogData = OrderLineMetadata & {
  variant: ProductVariantMetadata;
  productName: string;
};

interface OrderMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  data: OrderMetadataDialogData;
  loading?: boolean;
}

export const OrderMetadataDialog = ({ onClose, open, data, loading }: OrderMetadataDialogProps) => {
  const { onSubmit, lastSubmittedData } = useHandleOrderLineMetadataSubmit({ initialData: data });
  const hasManageProducts = useHasManageProductsPermission();

  const formMethods = useForm<MetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values: loading
      ? lastSubmittedData
      : {
          // Removes __typename from metadata item object
          metadata: (data?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (data?.privateMetadata ?? [])?.map(mapMetadataItemToInput),
        },
  });

  const { handleSubmit, control, getValues, formState, trigger } = formMethods;

  const allFormErrors = flattenErrors(formState.errors);

  const saveButtonState: ConfirmButtonTransitionState =
    formState.isSubmitting || loading ? "loading" : allFormErrors.length > 0 ? "error" : "default";

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.Header paddingX={6}>
          <FormattedMessage {...commonMessages.metadata} />: {data?.productName ?? ""}
        </DashboardModal.Header>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={5}>
            <Box display="flex" flexDirection="column" data-test-id={TEST_ID_ORDER_LINE_METADATA}>
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

              <MetadataHookForm
                isLoading={loading && !data}
                disabled={loading || formState.isSubmitting}
                control={control}
                getValues={getValues}
                trigger={trigger}
              />

              {allFormErrors.length > 0 && (
                <Text color="critical1" marginLeft={6} marginTop={4}>
                  {allFormErrors.join(", ")}
                </Text>
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
                isLoading={loading && !data}
                data={{
                  metadata: data?.variant?.metadata ?? [],
                  privateMetadata: data?.variant?.privateMetadata ?? [],
                }}
                hidePrivateMetadata={!hasManageProducts}
                paddingBottom={0}
              />
            </Box>
          </Box>
          <DashboardModal.Actions paddingX={6} marginTop={4}>
            <ButtonWithLoader
              transitionState={saveButtonState}
              data-test-id="save"
              variant={allFormErrors.length === 0 ? "primary" : "error"}
              type="submit"
              disabled={!formState.isDirty}
            >
              <FormattedMessage {...buttonMessages.save} />
            </ButtonWithLoader>
            <Button data-test-id="back" variant="secondary" onClick={onClose}>
              <FormattedMessage {...buttonMessages.close} />
            </Button>
          </DashboardModal.Actions>
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
