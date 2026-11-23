import { useMetadataDialogData } from "@dashboard/components/MetadataDialog/useMetadataDialogData";
import {
  OrderLinesMetadataDocument,
  type OrderLinesMetadataQuery,
  type OrderLinesMetadataQueryVariables,
} from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";

type OrderLineMetadata = NonNullable<OrderLinesMetadataQuery["order"]>["lines"][number];

interface MetadataValues {
  data: OrderLineMetadata | undefined;
  loading: boolean;
  loadFailed: boolean;
  retry: () => void;
}

/** Loads the line's metadata; use it in a component mounted only while the dialog is open. */
export const useMetadataValues = ({
  orderId,
  lineId,
}: {
  orderId: string;
  lineId: string;
}): MetadataValues => {
  const hasManageProducts = useHasManageProductsPermission();
  const { entity, contentLoading, loadError, onRetryLoad } = useMetadataDialogData<
    OrderLinesMetadataQuery,
    OrderLinesMetadataQueryVariables,
    OrderLineMetadata
  >({
    query: OrderLinesMetadataDocument,
    variables: { id: orderId, hasManageProducts },
    select: data => data.order?.lines.find(line => line.id === lineId),
  });

  return {
    data: entity,
    loading: contentLoading,
    loadFailed: loadError,
    retry: onRetryLoad,
  };
};
