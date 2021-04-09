import { ChannelData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { UseChannelsWithProductVariants } from "@saleor/products/views/ProductUpdate/types";
import {
  areAllVariantsAtAllChannelsSelected,
  areAnyChannelVariantsSelected
} from "@saleor/products/views/ProductUpdate/utils";
import isEqual from "lodash/isEqual";
import React, { useEffect, useRef, useState } from "react";
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
>;

export interface ChannelsAvailabilityDialogProps
  extends UseChannelsWithVariantsCommonProps {
  channels: ChannelData[];
  contentType?: string;
  variants: ProductDetails_product_variants[];
}

export const ChannelsWithVariantsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  channels,
  contentType,
  variants,
  isChannelsAvailabilityModalOpen,
  toggleAllChannels,
  channelsWithVariantsData,
  onChannelsAvailiabilityModalClose,
  haveChannelsWithVariantsDataChanged,
  onChannelsWithVariantsConfirm,
  ...rest
}) => {
  const intl = useIntl();
  const [canConfirm, setCanConfirm] = useState(false);
  const channelsWithVariantsDataRef = useRef(channelsWithVariantsData);
  const { query, onQueryChange, filteredChannels } = useChannelsSearch(
    channels
  );

  const handleSetCanConfirm = () => {
    const hasDataInsideDialogChanged = !isEqual(
      channelsWithVariantsData,
      channelsWithVariantsDataRef.current
    );

    if (hasDataInsideDialogChanged) {
      channelsWithVariantsDataRef.current = channelsWithVariantsData;
      setCanConfirm(true);
    }
  };

  useEffect(handleSetCanConfirm, [channelsWithVariantsData]);

  const hasAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
    variants,
    channelsWithVariantsData
  );

  const isChannelSelected = (channelId: string) =>
    areAnyChannelVariantsSelected(channelsWithVariantsData[channelId]);

  const handleClose = () => {
    setCanConfirm(false);
    onChannelsAvailiabilityModalClose();
  };

  const handleConfirm = () => {
    setCanConfirm(false);
    onChannelsWithVariantsConfirm();
  };

  return (
    <ActionDialog
      confirmButtonState="default"
      open={isChannelsAvailabilityModalOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={intl.formatMessage(messages.title)}
      disabled={!canConfirm}
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
          {...rest}
        />
      </ChannelsAvailabilityContentWrapper>
    </ActionDialog>
  );
};

export default ChannelsWithVariantsAvailabilityDialog;
