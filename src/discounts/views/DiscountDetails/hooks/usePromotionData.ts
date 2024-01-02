import { usePromotionDetailsQuery } from "@dashboard/graphql";
import { useEffect, useState } from "react";

export const usePromotionData = (id: string) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: promotionData, loading } = usePromotionDetailsQuery({
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (!isLoaded && !loading && promotionData?.promotion) {
      setIsLoaded(true);
    }
  }, [loading, isLoaded, promotionData?.promotion]);

  return {
    promotionData,
    loading: !isLoaded,
  };
};
