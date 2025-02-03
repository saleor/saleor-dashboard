import {
  CollectionChannelListingErrorFragment,
  ProductChannelListingCreateInput,
  ProductChannelListingErrorFragment,
} from "@dashboard/graphql";

export type ChannelOpts = Omit<ProductChannelListingCreateInput, "channelId">;

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
