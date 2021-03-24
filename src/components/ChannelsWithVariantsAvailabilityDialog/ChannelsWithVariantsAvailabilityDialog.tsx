import { ChannelData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { UseChannelsWithProductVariants } from "@saleor/products/views/ProductUpdate/types";
import {
  areAllVariantsAtAllChannelsSelected,
  areAnyChannelVariantsSelected
} from "@saleor/products/views/ProductUpdate/utils";
import { filter } from "fuzzaldrin";
import React from "react";

import ChannelsAvailabilityContentWrapper from "../ChannelsAvailabilityContent/ChannelsAvailabilityContentWrapper";
import { ConfirmButtonTransitionState } from "../ConfirmButton";
import ChannelsWithVariantsAvailabilityDialogContent from "./ChannelsWithVariantsAvailabilityDialogContent";

export interface ChannelsAvailabilityDialogProps
  extends UseChannelsWithProductVariants {
  channels: ChannelData[];
  confirmButtonState: ConfirmButtonTransitionState;
  contentType?: string;
  disabled: boolean;
  variants: ProductDetails_product_variants[];
  onConfirm: () => void;
  title: string;
}

export const ChannelsWithVariantsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  channels,
  confirmButtonState,
  contentType,
  disabled,
  onConfirm,
  title,
  variants,
  isChannelsAvailabilityModalOpen,
  toggleAllChannels,
  channelsWithVariants,
  onChannelsAvailiabilityModalClose,
  ...rest
}) => {
  const [query, onQueryChange] = React.useState("");
  const filteredChannels = filter(channels, query, { key: "name" }) || [];

  const hasAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
    variants,
    channelsWithVariants
  );

  const isChannelSelected = (channelId: string) =>
    areAnyChannelVariantsSelected(channelsWithVariants[channelId]);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={isChannelsAvailabilityModalOpen}
      onClose={onChannelsAvailiabilityModalClose}
      onConfirm={onConfirm}
      title={title}
      disabled={disabled}
    >
      <ChannelsAvailabilityContentWrapper
        hasAllSelected={hasAllChannelsSelected}
        hasAnyChannelsToDisplay={!!filteredChannels.length}
        query={query}
        onQueryChange={onQueryChange}
        toggleAll={toggleAllChannels}
        contentType={contentType}
        disabled={disabled}
      >
        <ChannelsWithVariantsAvailabilityDialogContent
          allVariants={variants}
          channels={channels}
          isChannelSelected={isChannelSelected}
          channelsWithVariants={channelsWithVariants}
          {...rest}
        />
      </ChannelsAvailabilityContentWrapper>
    </ActionDialog>
  );
};

export default ChannelsWithVariantsAvailabilityDialog;
