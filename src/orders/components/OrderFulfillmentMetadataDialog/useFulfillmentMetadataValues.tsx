import { useOrderFulfillmentMetadataLazyQuery } from "@dashboard/graphql";
import { useEffect, useMemo } from "react";

export const useFulfillmentMetadataValues = ({
  orderId,
  fulfillmentId,
  open,
}: {
  orderId: string;
  fulfillmentId: string;
  open: boolean;
}) => {
  const [fetchMetadata, { data, loading }] = useOrderFulfillmentMetadataLazyQuery();

  useEffect(
    function fetchOrderMetadataOnMount() {
      if (open) {
        fetchMetadata({ variables: { id: orderId } });
      }
    },
    [fetchMetadata, open, orderId],
  );

  const fulfillment = useMemo(() => {
    if (!fulfillmentId) {
      return undefined;
    }

    return data?.order?.fulfillments?.find(f => f.id === fulfillmentId);
  }, [data, fulfillmentId]);

  return {
    data: fulfillment,
    loading,
  } as const;
};
