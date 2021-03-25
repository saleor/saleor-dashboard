import { CollectionChannelListingErrorFragment } from "@saleor/fragments/types/CollectionChannelListingErrorFragment";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";

export interface ChannelValue {
  availableForPurchase?: string;
  isAvailableForPurchase?: boolean;
  isPublished: boolean;
  publicationDate: string | null;
  visibleInListings?: boolean;
}

export interface Message {
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

export interface ChannelData {
  id: string;
  isPublished: boolean;
  name: string;
  publicationDate: string | null;
  availableForPurchase?: string;
  isAvailableForPurchase?: boolean;
  visibleInListings?: boolean;
}

export type ChannelsAvailabilityError =
  | ProductChannelListingErrorFragment
  | CollectionChannelListingErrorFragment;
