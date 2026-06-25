import { type ChannelShippingData } from "@dashboard/channels/utils";
import { isMissingPriceValue } from "@dashboard/products/utils/validation";
import { createChannelsChangeHandler } from "@dashboard/shipping/handlers";
import {
  type ChannelPriceValue,
  getChannelIdsWithPrice,
  hasMissingChannelPrices,
} from "@dashboard/shipping/utils/channelPricingState";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseShippingRateChannelsOptions {
  shippingChannels: ChannelShippingData[];
  onChannelsChange: (channels: ChannelShippingData[]) => void;
  triggerChange: () => void;
}

export function useShippingRateChannels({
  shippingChannels,
  onChannelsChange,
  triggerChange,
}: UseShippingRateChannelsOptions) {
  const [pricedChannelIds, setPricedChannelIds] = useState<Set<string>>(() =>
    getChannelIdsWithPrice(shippingChannels),
  );

  useEffect(() => {
    const pricedIds = getChannelIdsWithPrice(shippingChannels);

    setPricedChannelIds(prev => {
      const hasNewPricedChannel = [...pricedIds].some(channelId => !prev.has(channelId));

      if (!hasNewPricedChannel) {
        return prev;
      }

      const next = new Set(prev);

      pricedIds.forEach(channelId => next.add(channelId));

      return next;
    });
  }, [shippingChannels]);

  const pricedChannelIdsList = useMemo(() => [...pricedChannelIds], [pricedChannelIds]);

  const handleChannelsChange = useCallback(
    (channelId: string, value: ChannelPriceValue) => {
      if (!isMissingPriceValue(value.price)) {
        setPricedChannelIds(prev => new Set(prev).add(channelId));
      }

      createChannelsChangeHandler(
        shippingChannels,
        onChannelsChange,
        triggerChange,
      )(channelId, value);
    },
    [onChannelsChange, shippingChannels, triggerChange],
  );

  const hasValidChannelPrices = !hasMissingChannelPrices(shippingChannels);

  return {
    handleChannelsChange,
    hasValidChannelPrices,
    pricedChannelIdsList,
  };
}
