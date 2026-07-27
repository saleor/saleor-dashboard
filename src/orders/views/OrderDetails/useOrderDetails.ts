import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import { useOrderDetailsQuery } from "@dashboard/graphql";

export const useOrderDetails = (id: string) => {
  const { data, loading, refetch, startPolling, stopPolling } = useOrderDetailsQuery({
    displayLoader: true,
    variables: { id },
  });

  useRegisterEntityRefresh(refetch);

  // Transaction polling is owned by TransactionOrderDetails so legacy and draft
  // orders never instantiate it; expose the query controls it needs.
  return {
    data,
    loading,
    refetch,
    startPolling,
    stopPolling,
  };
};
