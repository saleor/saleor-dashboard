import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import { useOrderDetailsQuery } from "@dashboard/graphql";

import { useOrderTransactionPolling } from "./useOrderTransactionPolling";

export const useOrderDetails = (id: string) => {
  const { data, loading, refetch, startPolling, stopPolling } = useOrderDetailsQuery({
    displayLoader: true,
    variables: { id },
  });

  useRegisterEntityRefresh(refetch);

  useOrderTransactionPolling({
    order: data?.order,
    startPolling,
    stopPolling,
    refetch,
  });

  return {
    data,
    loading,
  };
};
