import {
  CollectionChannelListingErrorFragment,
  ProductChannelListingErrorFragment,
} from "@saleor/graphql";

export interface ChannelOpts {
  availableForPurchase?: string;
  isAvailableForPurchase?: boolean;
  isPublished: boolean;
  publicationDate: string | null;
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
