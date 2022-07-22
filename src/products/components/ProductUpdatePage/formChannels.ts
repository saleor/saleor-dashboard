import { ChannelOpts } from "@saleor/components/ChannelsAvailabilityCard/types";
import {
  ProductChannelListingUpdateInput,
  ProductFragment,
} from "@saleor/graphql";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { toggle } from "@saleor/utils/lists";
import { useCallback } from "react";

const emptyListing = {
  availableForPurchaseDate: null,
  isAvailableForPurchase: false,
  isPublished: false,
  publicationDate: null,
  visibleInListings: false,
};

export function useProductChannelListingsForm(
  product: Pick<ProductFragment, "channelListings">,
  triggerChange: () => void,
) {
  const [channels, setChannels] = useStateFromProps<
    ProductChannelListingUpdateInput
  >({
    removeChannels: [],
    updateChannels:
      product?.channelListings.map(listing => ({
        channelId: listing.channel.id,
        availableForPurchaseDate: listing.availableForPurchase,
        ...listing,
      })) ?? [],
  });

  const handleChannelChange = useCallback((id: string, data: ChannelOpts) => {
    setChannels(prevData => ({
      ...prevData,
      updateChannels: prevData.updateChannels.map(prevListing =>
        prevListing.channelId === id
          ? { ...prevListing, ...data }
          : prevListing,
      ),
    }));
    triggerChange();
  }, []);

  const handleChannelToggle = useCallback(
    (id: string) => {
      setChannels(prevData => ({
        ...prevData,
        updateChannels: toggle(
          {
            channelId: id,
            ...emptyListing,
          },
          prevData.updateChannels,
          (a, b) => a.channelId === b.channelId,
        ),
        removeChannels: toggle(
          id,
          prevData.removeChannels,
          (a, b) => a === b,
        ).filter(id =>
          product.channelListings.find(listing => listing.channel.id === id),
        ),
      }));
      triggerChange();
    },
    [product],
  );

  return {
    channels,
    handleChannelChange,
    handleChannelToggle,
  };
}
