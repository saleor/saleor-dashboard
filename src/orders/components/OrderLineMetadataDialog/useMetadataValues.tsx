import { useOrderLinesMetadataLazyQuery } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { useEffect, useMemo } from "react";

export const useMetadataValues = ({
  orderId,
  lineId,
  open,
}: {
  orderId: string;
  lineId: string;
  open: boolean;
}) => {
  const hasManageProducts = useHasManageProductsPermission();
  const [fetchMetadata, { data, loading, error, refetch }] = useOrderLinesMetadataLazyQuery();

  useEffect(
    function fetchOrderLinesMetadataWhenDialogOpens() {
      if (open) {
        fetchMetadata({
          variables: { id: orderId, hasManageProducts },
        });
      }
    },
    [fetchMetadata, hasManageProducts, open, orderId],
  );

  const lineData = useMemo(() => {
    if (!lineId) {
      return undefined;
    }

    return data?.order?.lines.find(line => line.id === lineId);
  }, [data, lineId]);

  return {
    data: lineData,
    loading,
    // Lazy queries don't report errors on their own: the dialog shows this with a Retry button.
    loadFailed: !!error && !loading,
    retry: () => {
      void refetch?.();
    },
  } as const;
};
