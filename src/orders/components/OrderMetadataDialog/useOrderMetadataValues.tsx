import { useOrderMetadataLazyQuery } from "@dashboard/graphql";
import { useEffect } from "react";

export const useOrderMetadataValues = ({ orderId, open }: { orderId: string; open: boolean }) => {
  const [fetchMetadata, { data, loading, error, refetch }] = useOrderMetadataLazyQuery();

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
    // Lazy queries don't report errors on their own: the dialog shows this with a Retry button.
    loadFailed: !!error && !loading,
    retry: () => {
      void refetch?.();
    },
  } as const;
};
