import { usePromotionDetailsQuery } from "@dashboard/graphql";
import { useEffect, useRef } from "react";

export const usePromotionData = (id: string) => {
  const isLoaded = useRef(false);

  const { data: promotionData, loading } = usePromotionDetailsQuery({
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (!isLoaded.current && !loading && promotionData?.promotion) {
      isLoaded.current = true;
    }
  }, [loading, isLoaded.current, promotionData?.promotion]);

  return {
    promotionData,
    loading: !isLoaded.current,
  };
};
