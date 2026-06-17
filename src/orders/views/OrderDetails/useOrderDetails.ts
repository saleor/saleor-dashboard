import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import { useOrderDetailsQuery } from "@dashboard/graphql";

export const useOrderDetails = (id: string) => {
  const { data, loading, refetch } = useOrderDetailsQuery({
    displayLoader: true,
    variables: { id },
  });

  useRegisterEntityRefresh(refetch);

  return {
    data,
    loading,
  };
};
