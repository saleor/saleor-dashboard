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
        // Only update availableForPurchaseAt if availableForPurchase was explicitly passed
        ...(data.availableForPurchase !== undefined
          ? { availableForPurchaseAt: data.availableForPurchase }
          : {}),
      };
    }

    return listing;
  };

  return {
    ...input,
    updateChannels: input.updateChannels.map(mergeListings),
  };
};

/**
 * Channel availability fields that we track for dirty state.
 * Used for comparing form data against original/summary data.
 */
export interface ChannelAvailabilityFields {
  isPublished?: boolean | null;
  publishedAt?: string | null;
  isAvailableForPurchase?: boolean | null;
  availableForPurchaseAt?: string | null;
  visibleInListings?: boolean | null;
}

/**
 * Compare two channel availability states and determine if they differ.
 *
 * IMPORTANT: We preserve null in form data to avoid side effects on save.
 * During comparison, we normalize:
 * - isAvailableForPurchase: null → false (both mean "not available for purchase")
 * - dates: null/undefined → null (both mean "not set")
 *
 * This allows detecting actual user intent changes without false positives
 * from null vs false differences in isAvailableForPurchase.
 *
 * Schema types:
 * - isPublished: Boolean! (non-nullable, always boolean)
 * - isAvailableForPurchase: Boolean (nullable, can be null)
 * - visibleInListings: Boolean! (non-nullable, always boolean)
 * - publishedAt/availableForPurchaseAt: DateTime (nullable)
 */
export const areChannelFieldsDifferent = (
  current: ChannelAvailabilityFields,
  original: ChannelAvailabilityFields,
): boolean => {
  // isPublished: Boolean! - direct comparison (always boolean)
  if (current.isPublished !== original.isPublished) {
    return true;
  }

  // publishedAt: DateTime - normalize null/undefined
  if ((current.publishedAt ?? null) !== (original.publishedAt ?? null)) {
    return true;
  }

  // availableForPurchaseAt: DateTime - this is the SOURCE OF TRUTH for availability
  // IMPORTANT: Do NOT compare isAvailableForPurchase because it's COMPUTED by Saleor:
  // - date is null → isAvailableForPurchase = false/null
  // - date is in past → isAvailableForPurchase = true
  // - date is in future → isAvailableForPurchase = false (scheduled!)
  //
  // The form sends isAvailableForPurchase as user intent (true = "set a date", false = "clear date")
  // but the original from server is the COMPUTED value. These won't match for scheduled products.
  // So we only compare the actual date - if dates match, the availability state matches.
  if ((current.availableForPurchaseAt ?? null) !== (original.availableForPurchaseAt ?? null)) {
    return true;
  }

  // visibleInListings: Boolean! - direct comparison (always boolean)
  if (current.visibleInListings !== original.visibleInListings) {
    return true;
  }

  return false;
};

// Compare a single channel's current state with its original state
const isChannelDirty = (
  current: ProductChannelListingAddInput,
  original: ProductFragment["channelListings"][number] | undefined,
): boolean => {
  if (!original) {
    // New channel that wasn't in original - always dirty
    return true;
  }

  return areChannelFieldsDifferent(current, original);
};

// Check if any channels have changes compared to original product
const hasChannelChanges = (
  channels: ProductChannelListingUpdateInput,
  originalListings: ProductFragment["channelListings"],
): boolean => {
  const originalIds = new Set(originalListings?.map(l => l.channel.id) ?? []);

  // Check if any original channels were removed (ignore removals of channels that weren't in original)
  const removedOriginalChannels = channels.removeChannels.filter(id => originalIds.has(id));

  if (removedOriginalChannels.length > 0) {
    return true;
  }

  // Check if any channels have been modified
  for (const current of channels.updateChannels) {
    const original = originalListings?.find(l => l.channel.id === current.channelId);

    if (isChannelDirty(current, original)) {
      return true;
    }
  }

  // Check if any new channels were added
  for (const current of channels.updateChannels) {
    if (!originalIds.has(current.channelId)) {
      return true;
    }
  }

  return false;
};

export function useProductChannelListingsForm(
  product: Pick<ProductFragment, "channelListings">,
  triggerChange: (value?: boolean) => void,
) {
  const [channels, setChannels] = useStateFromProps<ProductChannelListingUpdateInput>({
    removeChannels: [],
    // Initialize form with explicit field values (no spread)
    // IMPORTANT: We preserve original values including null for isAvailableForPurchase
    // This ensures we don't change API values as a side effect when saving
    // Dirty detection normalizes null/false during comparison (both mean "not available")
    updateChannels: product?.channelListings.map(listing => ({
      channelId: listing.channel.id,
      isPublished: listing.isPublished,
      publishedAt: listing.publishedAt,
      isAvailableForPurchase: listing.isAvailableForPurchase, // Preserve null - don't normalize
      availableForPurchaseAt: listing.availableForPurchaseAt,
      visibleInListings: listing.visibleInListings,
    })),
  });
  const touched = useRef<string[]>([]);
  const touch = (id: string) => {
    touched.current = uniq([...touched.current, id]);
  };
  const handleChannelChange = useCallback(
    (id: string, data: ChannelOpts) => {
      setChannels(input => {
        const newInput = updateChannelsInput(input, data, id);

        // Check dirty state and trigger change synchronously within the updater.
        // This ensures we have the correct new state for comparison.
        // Note: While side effects in updaters are generally discouraged,
        // this is acceptable here because:
        // 1. triggerChange is idempotent - multiple calls with same value are safe
        // 2. We need atomic dirty state tracking with state computation
        const isDirty = hasChannelChanges(newInput, product?.channelListings);

        triggerChange(isDirty);

        return newInput;
      });
      touch(id);
    },
    [setChannels, triggerChange, product?.channelListings],
  );
  const handleChannelListUpdate: ProductChannelsListingDialogSubmit = useCallback(
    ({ added, removed }) => {
      setChannels(prevData => {
        const originalChannelIds = new Set(product?.channelListings?.map(l => l.channel.id) ?? []);

        // Separate removed channels: original channels go to removeChannels,
        // newly added channels are just removed from updateChannels
        const removedOriginalChannels = removed.filter(id => originalChannelIds.has(id));
        const removedNewChannels = removed.filter(id => !originalChannelIds.has(id));

        const newData = {
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
          removeChannels: uniq([
            ...prevData.removeChannels.filter(id => !removedNewChannels.includes(id)),
            ...removedOriginalChannels,
          ]).filter(id => !added.includes(id)),
        };

        // Check dirty state and trigger change synchronously within the updater.
        // This ensures we have the correct new state for comparison.
        // Note: While side effects in updaters are generally discouraged,
        // this is acceptable here because:
        // 1. triggerChange is idempotent - multiple calls with same value are safe
        // 2. We need atomic dirty state tracking with state computation
        const isDirty = hasChannelChanges(newData, product?.channelListings);

        triggerChange(isDirty);

        return newData;
      });
      added.forEach(id => touch(id));
    },
    [product, triggerChange],
  );

  return {
    channels,
    handleChannelChange,
    handleChannelListUpdate,
    touched,
  };
}
