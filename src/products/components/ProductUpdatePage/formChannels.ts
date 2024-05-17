// @ts-strict-ignore
import { ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import {
  ProductChannelListingAddInput,
  ProductChannelListingUpdateInput,
  ProductFragment,
} from "@dashboard/graphql";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import { useCallback, useRef } from "react";

import { ProductChannelsListingDialogSubmit } from "./ProductChannelsListingsDialog";

const emptyListing: Omit<ProductChannelListingAddInput, "channelId"> = {
  availableForPurchaseAt: null,
  isAvailableForPurchase: false,
  isPublished: false,
  publishedAt: null,
  visibleInListings: false,
};

export const updateChannelsInput = (
  input: ProductChannelListingUpdateInput,
  data: ChannelOpts,
  id: string,
) => {
  const mergeListings = (listing: ProductChannelListingAddInput) => {
    if (listing.channelId === id) {
      return {
        ...listing,
        ...data,
        availableForPurchaseAt: data.availableForPurchase,
      };
    }

    return listing;
  };

  return {
    ...input,
    updateChannels: input.updateChannels.map(mergeListings),
  };
};

export function useProductChannelListingsForm(
  product: Pick<ProductFragment, "channelListings">,
  triggerChange: () => void,
) {
  const [channels, setChannels] = useStateFromProps<ProductChannelListingUpdateInput>({
    removeChannels: [],
    updateChannels: product?.channelListings.map(listing => ({
      channelId: listing.channel.id,
      availableForPurchaseAt: listing.availableForPurchaseAt,
      ...listing,
    })),
  });
  const touched = useRef<string[]>([]);
  const touch = (id: string) => {
    touched.current = uniq([...touched.current, id]);
  };
  const handleChannelChange = useCallback(
    (id: string, data: ChannelOpts) => {
      setChannels(input => updateChannelsInput(input, data, id));
      triggerChange();
      touch(id);
    },
    [setChannels, triggerChange],
  );
  const handleChannelListUpdate: ProductChannelsListingDialogSubmit = useCallback(
    ({ added, removed }) => {
      setChannels(prevData => ({
        ...prevData,
        updateChannels: uniqBy(
          [
            ...prevData.updateChannels,
            ...added.map(id => ({
              channelId: id,
              ...emptyListing,
            })),
          ],
          "channelId",
        ).filter(({ channelId }) => !removed.includes(channelId)),
        removeChannels: uniq([...prevData.removeChannels, ...removed]).filter(
          id => !added.includes(id),
        ),
      }));
      triggerChange();
      added.forEach(id => touch(id));
    },
    [product],
  );

  return {
    channels,
    handleChannelChange,
    handleChannelListUpdate,
    touched,
  };
}
