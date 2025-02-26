import { useOrderLinesMetadataLazyQuery } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { useEffect, useMemo } from "react";

export const useMetadataValues = ({
  open,
  orderId,
  lineId,
}: {
  open: boolean;
  orderId: string;
  lineId: string;
}) => {
  const [fetchMetadata, { data, loading }] = useOrderLinesMetadataLazyQuery({
    fetchPolicy: "network-only",
  });
  const hasManageProducts = useHasManageProductsPermission();

  useEffect(() => {
    if (open) {
      fetchMetadata({
        variables: {
          id: orderId,
          hasManageProducts: hasManageProducts,
        },
      });
    }
  }, [fetchMetadata, hasManageProducts, open, orderId]);

  const lineData = useMemo(() => {
    return data?.order?.lines.find(line => line.id === lineId);
  }, [data, lineId]);

  return {
    data: lineData,
    loading,
  } as const;
};
