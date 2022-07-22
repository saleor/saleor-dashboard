import { ChannelOpts } from "@saleor/components/ChannelsAvailabilityCard/types";
import {
  ProductChannelListingUpdateInput,
  ProductFragment,
} from "@saleor/graphql";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { toggle } from "@saleor/utils/lists";
import uniq from "lodash/uniq";
import { useCallback, useRef } from "react";

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
  const touched = useRef<string[]>([]);

  const touch = (id: string) => {
    touched.current = uniq([...touched.current, id]);
  };

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
    touch(id);
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
      touch(id);
    },
    [product],
  );

  return {
    channels,
    handleChannelChange,
    handleChannelToggle,
    touched,
  };
}
