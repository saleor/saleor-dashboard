import {
  PromotionDetailsQuery,
  RewardTypeEnum,
  useGiftLabelsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useEffect, useState } from "react";

export const useFetchGiftLables = (
  promotionData: PromotionDetailsQuery | undefined,
) => {
  const [hasBeenLoaded, setHasBeenLoaded] = useState(false);

  const giftsIds = getAllGiftsIdsToFetch(promotionData);

  const { loading, data } = useGiftLabelsQuery({
    variables: {
      ids: giftsIds,
    },
  });

  useEffect(() => {
    if (promotionData?.promotion && !loading) {
      setHasBeenLoaded(true);
    }
  }, [promotionData, loading]);

  return {
    loading: !hasBeenLoaded,
    giftsLabels: (mapEdgesToItems(data?.productVariants) ?? []).reduce(
      (acc, gift) => {
        acc[gift.id] = `${gift.name} (${gift.product.name})`;
        return acc;
      },
      {},
    ),
  };
};

function getAllGiftsIdsToFetch(
  data: PromotionDetailsQuery | undefined,
): string[] {
  if (!data?.promotion?.rules) {
    return [];
  }

  const allGiftsIds = data.promotion.rules
    .filter(
      rule =>
        rule.rewardType === RewardTypeEnum.GIFT && rule.giftIds.length > 0,
    )
    .flatMap(rule => rule.giftIds);

  return Array.from(new Set(allGiftsIds));
}
