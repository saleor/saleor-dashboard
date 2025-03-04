import { OrderLineMetadataDetailsFragment, useOrderLinesMetadataQuery } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { useMemo } from "react";

export const useMetadataValues = ({ orderId, lineId }: { orderId: string; lineId: string }) => {
  const hasManageProducts = useHasManageProductsPermission();
  const { data, loading } = useOrderLinesMetadataQuery({
    variables: { id: orderId, hasManageProducts },
  });

  const lineData = useMemo(() => {
    if (!lineId) {
      return null;
    }

    return data?.order?.lines.find(line => line.id === lineId);
  }, [data, lineId]);

  return {
    data: lineData as OrderLineMetadataDetailsFragment,
    loading,
  } as const;
};
