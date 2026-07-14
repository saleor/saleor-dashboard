import { useOrderMetadataLazyQuery } from "@dashboard/graphql";
import { useEffect } from "react";

export const useOrderMetadataValues = ({ orderId, open }: { orderId: string; open: boolean }) => {
  const [fetchMetadata, { data, loading }] = useOrderMetadataLazyQuery();

  useEffect(
    function fetchOrderMetadataOnMount() {
      if (open) {
        fetchMetadata({ variables: { id: orderId } });
      }
    },
    [fetchMetadata, open, orderId],
  );

  return {
    data: data?.order ?? undefined,
    loading,
  } as const;
};
