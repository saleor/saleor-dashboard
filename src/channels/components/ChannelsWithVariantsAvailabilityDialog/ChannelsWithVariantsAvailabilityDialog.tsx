import { ChannelData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ProductDetailsVariantFragment } from "@saleor/graphql";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import { ChannelVariantListing } from "@saleor/products/views/ProductUpdate/types";
import useChannelsWithProductVariants from "@saleor/products/views/ProductUpdate/useChannelsWithProductVariants";
import {
  areAllVariantsAtAllChannelsSelected,
  areAnyChannelVariantsSelected,
  channelVariantListingDiffToDict,
} from "@saleor/products/views/ProductUpdate/utils";
import { DialogProps } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { useChannelsSearch } from "../../../components/ChannelsAvailabilityDialog/utils";
import ChannelsAvailabilityContentWrapper from "../../../components/ChannelsAvailabilityDialogWrapper/ChannelsAvailabilityDialogWrapper";
import ChannelsWithVariantsAvailabilityDialogContent from "./ChannelsWithVariantsAvailabilityDialogContent";

const messages = defineMessages({
  title: {
    id: "p/EWEZ",
    defaultMessage: "Manage Channels",
    description: "channels variants availability dialog title",
  },
});

export interface ChannelsAvailabilityDialogProps extends DialogProps {
  channels: ChannelData[];
  contentType?: string;
  variants: ProductDetailsVariantFragment[];
  onConfirm: (listings: ChannelVariantListing) => void;
}

export const ChannelsWithVariantsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  channels,
  contentType,
  variants,
  open,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();
  const {
    channelsWithVariantsData,
    toggleAllChannels,
    addVariantToChannel,
    removeVariantFromChannel,
    toggleAllChannelVariants,
    channelVariantListing,
    reset,
  } = useChannelsWithProductVariants(
    channels,
    variants?.map(variant => variant.id),
  );

  useModalDialogOpen(open, {
    onClose: reset,
  });

  const { query, onQueryChange, filteredChannels } = useChannelsSearch(
    channels,
  );

  const hasAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
    variants.map(variant => variant.id),
    channelVariantListingDiffToDict(channelsWithVariantsData),
  );

  const isChannelSelected = (channelId: string) =>
    areAnyChannelVariantsSelected(channelsWithVariantsData[channelId]);

  return (
    <ActionDialog
      confirmButtonState="default"
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(channelVariantListing)}
      title={intl.formatMessage(messages.title)}
    >
      <ChannelsAvailabilityContentWrapper
        hasAllSelected={hasAllChannelsSelected}
        hasAnyChannelsToDisplay={!!filteredChannels.length}
        query={query}
        onQueryChange={onQueryChange}
        toggleAll={toggleAllChannels}
        contentType={contentType}
      >
        <ChannelsWithVariantsAvailabilityDialogContent
          allVariants={variants}
          channels={filteredChannels}
          isChannelSelected={isChannelSelected}
          channelsWithVariants={channelsWithVariantsData}
          addVariantToChannel={addVariantToChannel}
          removeVariantFromChannel={removeVariantFromChannel}
          toggleAllChannelVariants={toggleAllChannelVariants}
        />
      </ChannelsAvailabilityContentWrapper>
    </ActionDialog>
  );
};

export default ChannelsWithVariantsAvailabilityDialog;
