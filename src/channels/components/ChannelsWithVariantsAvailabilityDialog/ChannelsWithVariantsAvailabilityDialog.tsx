import { ChannelData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { UseChannelsWithProductVariants } from "@saleor/products/views/ProductUpdate/types";
import {
  areAllVariantsAtAllChannelsSelected,
  areAnyChannelVariantsSelected,
  channelVariantListingDiffToDict
} from "@saleor/products/views/ProductUpdate/utils";
import { DialogProps } from "@saleor/types";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";

import { useChannelsSearch } from "../../../components/ChannelsAvailabilityDialog/utils";
import ChannelsAvailabilityContentWrapper from "../../../components/ChannelsAvailabilityDialogWrapper/ChannelsAvailabilityDialogWrapper";
import ChannelsWithVariantsAvailabilityDialogContent from "./ChannelsWithVariantsAvailabilityDialogContent";

const messages = defineMessages({
  title: {
    defaultMessage: "Manage Channels",
    description: "channels variants availability dialog title"
  }
});

type UseChannelsWithVariantsCommonProps = Omit<
  UseChannelsWithProductVariants,
  | "onChannelsAvailiabilityModalOpen"
  | "setHaveChannelsWithVariantsChanged"
  | "channelsData"
  | "setChannelsData"
  | "hasChanged"
>;

export interface ChannelsAvailabilityDialogProps
  extends UseChannelsWithVariantsCommonProps,
    DialogProps {
  channels: ChannelData[];
  contentType?: string;
  variants: ProductDetails_product_variants[];
  onConfirm: () => void;
}

export const ChannelsWithVariantsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  channels,
  contentType,
  variants,
  open,
  toggleAllChannels,
  channelsWithVariantsData,
  onClose,
  onConfirm,
  addVariantToChannel,
  removeVariantFromChannel,
  toggleAllChannelVariants
}) => {
  const intl = useIntl();
  const [changed, setChanged] = useState(false);
  const { query, onQueryChange, filteredChannels } = useChannelsSearch(
    channels
  );

  const hasAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
    variants.map(variant => variant.id),
    channelVariantListingDiffToDict(channelsWithVariantsData)
  );

  const isChannelSelected = (channelId: string) =>
    areAnyChannelVariantsSelected(channelsWithVariantsData[channelId]);

  function withChange<T>(
    fn: (...args: any[]) => T,
    change: boolean
  ): (...args: any[]) => T {
    return (...args: any[]) => {
      setChanged(change);
      return fn(...args);
    };
  }

  return (
    <ActionDialog
      confirmButtonState="default"
      open={open}
      onClose={withChange(onClose, false)}
      onConfirm={withChange(onConfirm, false)}
      title={intl.formatMessage(messages.title)}
      disabled={!changed}
    >
      <ChannelsAvailabilityContentWrapper
        hasAllSelected={hasAllChannelsSelected}
        hasAnyChannelsToDisplay={!!filteredChannels.length}
        query={query}
        onQueryChange={onQueryChange}
        toggleAll={withChange(toggleAllChannels, true)}
        contentType={contentType}
      >
        <ChannelsWithVariantsAvailabilityDialogContent
          allVariants={variants}
          channels={filteredChannels}
          isChannelSelected={isChannelSelected}
          channelsWithVariants={channelsWithVariantsData}
          addVariantToChannel={withChange(addVariantToChannel, true)}
          removeVariantFromChannel={withChange(removeVariantFromChannel, true)}
          toggleAllChannelVariants={withChange(toggleAllChannelVariants, true)}
        />
      </ChannelsAvailabilityContentWrapper>
    </ActionDialog>
  );
};

export default ChannelsWithVariantsAvailabilityDialog;
