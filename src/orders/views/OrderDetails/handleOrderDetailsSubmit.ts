import { type FetchResult } from "@apollo/client";
import { type MetadataIdSchema } from "@dashboard/components/Metadata";
import {
  type MetadataErrorFragment,
  type OrderConfirmMutation,
  type OrderConfirmMutationVariables,
  type OrderDetailsFragment,
  type OrderErrorFragment,
  OrderStatus,
  type UpdateMetadataMutation,
  type UpdateMetadataMutationVariables,
  type UpdatePrivateMetadataMutation,
  type UpdatePrivateMetadataMutationVariables,
} from "@dashboard/graphql";
import { type useNotifier } from "@dashboard/hooks/useNotifier";
import { createOrderMetadataIdSchema } from "@dashboard/orders/components/OrderDetailsPage/utils";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { areMetadataArraysEqual } from "@dashboard/utils/handlers/metadataUpdateHelpers";
import { type IntlShape } from "react-intl";

type OrderDetailsSubmitError = MetadataErrorFragment | OrderErrorFragment;

interface HandleOrderDetailsSubmitParams {
  formData: MetadataIdSchema;
  intl: IntlShape;
  notify: ReturnType<typeof useNotifier>;
  order: OrderDetailsFragment | undefined;
  orderConfirm: (variables: {
    variables: OrderConfirmMutationVariables;
  }) => Promise<FetchResult<OrderConfirmMutation>>;
  updateMetadata: (
    variables: UpdateMetadataMutationVariables,
  ) => Promise<FetchResult<UpdateMetadataMutation>>;
  updatePrivateMetadata: (
    variables: UpdatePrivateMetadataMutationVariables,
  ) => Promise<FetchResult<UpdatePrivateMetadataMutation>>;
}

export const handleOrderDetailsSubmit = async ({
  formData,
  intl,
  notify,
  order,
  orderConfirm,
  updateMetadata,
  updatePrivateMetadata,
}: HandleOrderDetailsSubmitParams): Promise<OrderDetailsSubmitError[]> => {
  if (!order) {
    return [];
  }

  if (order.status === OrderStatus.UNCONFIRMED) {
    const confirmResult = await orderConfirm({ variables: { id: order.id } });
    const confirmErrors = confirmResult.data?.orderConfirm?.errors ?? [];

    if (confirmErrors.length > 0) {
      return confirmErrors;
    }
  }

  const initial = createOrderMetadataIdSchema(order);
  const hasMetadataChanges = Object.entries(initial).some(([metadataId, metaEntry]) => {
    const formEntry = formData[metadataId];

    if (!formEntry) {
      return false;
    }

    return (
      !areMetadataArraysEqual(metaEntry.metadata, formEntry.metadata) ||
      !areMetadataArraysEqual(metaEntry.privateMetadata, formEntry.privateMetadata)
    );
  });
  const metadataPromises = Object.entries(initial).map(([id, metaEntry]) => {
    const update = createMetadataUpdateHandler(
      { ...metaEntry, id },
      () => Promise.resolve([]),
      variables => updateMetadata(variables),
      variables => updatePrivateMetadata(variables),
    );

    return update(formData[id]);
  });
  const result = await Promise.all(metadataPromises);
  const errors = result.reduce<OrderDetailsSubmitError[]>((accumulator, current) => {
    return accumulator.concat(current);
  }, []);

  if (errors.length === 0 && hasMetadataChanges) {
    notify({
      status: "success",
      text: intl.formatMessage({
        id: "gelco+",
        defaultMessage: "Metadata updated",
      }),
    });
  }

  return errors;
};
