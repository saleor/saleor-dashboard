import {
  CollectionChannelListingErrorFragment,
  ProductChannelListingErrorFragment,
} from "@dashboard/graphql";

export interface ChannelOpts {
  availableForPurchase?: string;
  isAvailableForPurchase?: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  visibleInListings?: boolean;
}

export interface Messages {
  visibleLabel: string;
  hiddenLabel: string;
  visibleSecondLabel?: string;
  hiddenSecondLabel?: string;
  availableDateText?: string;
  availableLabel?: string;
  unavailableLabel?: string;
  availableSecondLabel?: string;
  setAvailabilityDateLabel?: string;
}

export type ChannelsAvailabilityError =
  | ProductChannelListingErrorFragment
  | CollectionChannelListingErrorFragment;
