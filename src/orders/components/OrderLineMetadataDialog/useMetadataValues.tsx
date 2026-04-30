import {
  type OrderLineMetadataDetailsFragment,
  useOrderLinesMetadataQuery,
} from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { useMemo } from "react";

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
  const { data, loading } = useOrderLinesMetadataQuery({
    variables: { id: orderId, hasManageProducts },
    skip: !open,
    fetchPolicy: "network-only",
    errorPolicy: "all",
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
