import { useOrderDetailsQuery } from "@dashboard/graphql";

export const useOrderDetails = (id: string) => {
  const { data, loading } = useOrderDetailsQuery({
    displayLoader: true,
    variables: { id },
  });

  return {
    data,
    loading,
  };
};
