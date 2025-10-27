import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { MetadataLoadingCard } from "@dashboard/components/Metadata/MetadataLoadingCard";
import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { DashboardModal } from "@dashboard/components/Modal";
import { MetadataInput, OrderLinesMetadataQuery } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { Box, Button, Divider, Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldError, useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { OrderLineDetails } from "./OrderLineDetails/OrderLineDetails";
import { TEST_ID_ORDER_LINE_METADATA, TEST_ID_PRODUCT_VARIANT_METADATA } from "./test-ids";
import { useHandleOrderLineMetadataSubmit } from "./useHandleSubmit";
import { useMetadataValues } from "./useMetadataValues";

export type OrderMetadataDialogData = NonNullable<OrderLinesMetadataQuery["order"]>["lines"][0];

export interface OrderAndVariantMetadataFormData {
  orderLine: MetadataFormData;
  variant: MetadataFormData;
}

const getValidateMetadata =
  (intl: IntlShape) =>
  (metadata: MetadataInput[]): true | string => {
    const keys = metadata.map(entry => entry.key);
    const uniqueKeys = new Set(keys);

    if (uniqueKeys.size !== keys.length) {
      return intl.formatMessage({
        defaultMessage: "Metadata keys must be unique, remove duplicate key",
        description: "metadata edit form, error message",
        id: "MfWHGz",
      });
    }

    if (keys.some(key => key === "")) {
      return intl.formatMessage({
        defaultMessage: "Metadata key cannot be empty",
        description: "metadata edit form, error message",
        id: "lb5uDM",
      });
    }

    return true;
  };

/**
 * Maps FieldArrayWithId to MetadataInput by extracting only key and value properties.
 * FieldArrayWithId includes an 'id' field used by react-hook-form for tracking,
 * but MetadataInput only needs key and value.
 */
const mapFieldArrayToMetadataInput = (
  fields: Array<Record<"id", string> & MetadataInput>,
): MetadataInput[] => {
  return fields.map(field => ({
    key: field.key,
    value: field.value,
  }));
};

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
  const intl = useIntl();
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

  // Order Line metadata field arrays
  const orderLineMetadataControls = useFieldArray<OrderAndVariantMetadataFormData>({
    control,
    name: "orderLine.metadata" as FieldArrayPath<OrderAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const orderLinePrivateMetadataControls = useFieldArray<OrderAndVariantMetadataFormData>({
    control,
    name: "orderLine.privateMetadata" as FieldArrayPath<OrderAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  // Variant metadata field arrays
  const variantMetadataControls = useFieldArray<OrderAndVariantMetadataFormData>({
    control,
    name: "variant.metadata" as FieldArrayPath<OrderAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const variantPrivateMetadataControls = useFieldArray<OrderAndVariantMetadataFormData>({
    control,
    name: "variant.privateMetadata" as FieldArrayPath<OrderAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  // Create change handler factory
  const getHandleChange = ({
    fieldPrefix,
    type,
  }: {
    fieldPrefix: "orderLine" | "variant";
    type: "metadata" | "privateMetadata";
  }) => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls =
        fieldPrefix === "orderLine"
          ? metadataType === "metadata"
            ? orderLineMetadataControls
            : orderLinePrivateMetadataControls
          : metadataType === "metadata"
            ? variantMetadataControls
            : variantPrivateMetadataControls;

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        // Dynamic path is necessary for nested arrays but not fully type-safe
        const existingValue = getValues(`${fieldPrefix}.${metadataType}.${fieldIndex}`);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...existingValue,
          [fieldObjKey]: value,
        });

        // Trigger re-validation of data at the parent path
        trigger(`${fieldPrefix}.${metadataType}`);
      }

      if (action === EventDataAction.add) {
        calledMetadataControls.append({ key: "", value: "" });
      }

      if (action === EventDataAction.delete && typeof fieldIndex === "number") {
        calledMetadataControls.remove(fieldIndex);
      }
    };
  };

  // Order Line change handlers
  const handleOrderLineMetadataChange = getHandleChange({
    fieldPrefix: "orderLine",
    type: "metadata",
  });
  const handleOrderLinePrivateMetadataChange = getHandleChange({
    fieldPrefix: "orderLine",
    type: "privateMetadata",
  });

  // Variant change handlers
  const handleVariantMetadataChange = getHandleChange({
    fieldPrefix: "variant",
    type: "metadata",
  });
  const handleVariantPrivateMetadataChange = getHandleChange({
    fieldPrefix: "variant",
    type: "privateMetadata",
  });

  // Error handling
  const orderLineMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.orderLine?.metadata as FieldError),
    [formState.errors.orderLine?.metadata],
  );
  const orderLinePrivateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.orderLine?.privateMetadata as FieldError),
    [formState.errors.orderLine?.privateMetadata],
  );
  const variantMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.variant?.metadata as FieldError),
    [formState.errors.variant?.metadata],
  );
  const variantPrivateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.variant?.privateMetadata as FieldError),
    [formState.errors.variant?.privateMetadata],
  );

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
                      data={mapFieldArrayToMetadataInput(orderLineMetadataControls.fields)}
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
                      data={mapFieldArrayToMetadataInput(orderLinePrivateMetadataControls.fields)}
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
                      data={mapFieldArrayToMetadataInput(variantMetadataControls.fields)}
                      isPrivate={false}
                      disabled={loading || submitInProgress || !hasManageProducts}
                      onChange={handleVariantMetadataChange}
                      error={
                        variantMetadataErrors.length ? variantMetadataErrors.join(", ") : undefined
                      }
                    />

                    {hasManageProducts && (
                      <MetadataCard
                        data={mapFieldArrayToMetadataInput(variantPrivateMetadataControls.fields)}
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
