import { ChannelData } from "@saleor/channels/utils";
import ChannelAvailabilityItemContent from "@saleor/components/ChannelsAvailabilityCard/Channel/ChannelAvailabilityItemContent";
import ChannelsAvailabilityCardWrapper, {
  ChannelsAvailabilityWrapperProps,
} from "@saleor/components/ChannelsAvailabilityCard/ChannelsAvailabilityCardWrapper";
import {
  ChannelOpts,
  ChannelsAvailabilityError,
  Messages,
} from "@saleor/components/ChannelsAvailabilityCard/types";
import { getChannelsAvailabilityMessages } from "@saleor/components/ChannelsAvailabilityCard/utils";
import { PermissionEnum, ProductDetailsVariantFragment } from "@saleor/graphql";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import {
  areAnyChannelVariantsSelected,
  getTotalSelectedChannelsCount,
} from "@saleor/products/views/ProductUpdate/utils";
import React from "react";
import { useIntl } from "react-intl";

import ChannelWithVariantsAvailabilityItemWrapper from "./ChannelWithVariantAvailabilityItemWrapper";

type CommonChannelsAvailabilityProps = Omit<
  ChannelsAvailabilityWrapperProps,
  | "children"
  | "selectedChannelsCount"
  | "allChannelsCount"
  | "managePermissions"
>;

export interface ChannelsWithVariantsAvailabilityCardProps
  extends CommonChannelsAvailabilityProps {
  channelsWithVariantsData: ChannelsWithVariantsData;
  channels: ChannelData[];
  variants: ProductDetailsVariantFragment[];
  errors?: ChannelsAvailabilityError[];
  messages: Messages;
  onChange: (id: string, data: ChannelOpts) => void;
}

const ChannelsWithVariantsAvailabilityCard: React.FC<ChannelsWithVariantsAvailabilityCardProps> = ({
  channels,
  channelsWithVariantsData,
  openModal,
  variants,
  errors = [],
  messages,
  onChange,
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  const channelsMessages = getChannelsAvailabilityMessages({
    messages,
    channels,
    intl,
    localizeDate,
  });

  const allChannelsCount = channels.length;

  const selectedChannelsCount = getTotalSelectedChannelsCount(
    channelsWithVariantsData,
  );

  return (
    <ChannelsAvailabilityCardWrapper
      managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
      selectedChannelsCount={selectedChannelsCount}
      allChannelsCount={allChannelsCount}
      openModal={openModal}
    >
      {channels
        .filter(({ id }) =>
          areAnyChannelVariantsSelected(channelsWithVariantsData[id]),
        )
        .map(({ id }) => (
          <ChannelWithVariantsAvailabilityItemWrapper
            messages={channelsMessages[id]}
            key={id}
            channelsWithVariantsData={channelsWithVariantsData}
            variants={variants}
            channels={channels}
            channelId={id}
          >
            <ChannelAvailabilityItemContent
              onChange={onChange}
              data={channels.find(getById(id))}
              errors={errors}
              messages={channelsMessages[id]}
            />
          </ChannelWithVariantsAvailabilityItemWrapper>
        ))}
    </ChannelsAvailabilityCardWrapper>
  );
};

export default ChannelsWithVariantsAvailabilityCard;
