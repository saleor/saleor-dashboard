import { ChannelData } from "@saleor/channels/utils";
import ChannelContent from "@saleor/components/ChannelsAvailability/ChannelContent";
import ChannelsAvailabilityWrapper, {
  ChannelsAvailabilityWrapperProps
} from "@saleor/components/ChannelsAvailability/ChannelsAvailabilityWrapper";
import {
  ChannelsAvailabilityError,
  Message
} from "@saleor/components/ChannelsAvailability/types";
import { getChannelsAvailabilityMessages } from "@saleor/components/ChannelsAvailability/utils";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import { getTotalSelectedChannelsCount } from "@saleor/products/views/ProductUpdate/utils";
import React from "react";
import { useIntl } from "react-intl";

import ChannelWithVariantsAvailabilityItemWrapper from "./ChannelWithVariantAvailabilityItemWrapper";

interface ChannelsWithVariantsAvailabilityCardProps
  extends Omit<ChannelsAvailabilityWrapperProps, "children"> {
  channelsWithVariantsData: ChannelsWithVariantsData;
  channels: ChannelData[];
  variants: ProductDetails_product_variants[];
  errors?: ChannelsAvailabilityError[];
  messages: Message;
}

const ChannelsWithVariantsAvailabilityCard: React.FC<ChannelsWithVariantsAvailabilityCardProps> = ({
  channels,
  channelsWithVariantsData,
  openModal,
  variants,
  errors,
  messages
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  const channelsMessages = getChannelsAvailabilityMessages({
    messages,
    channels,
    intl,
    localizeDate
  });

  const allChannelsCount = channels.length;
  const selectedChannelsCount = getTotalSelectedChannelsCount(
    channelsWithVariantsData
  );

  return (
    <ChannelsAvailabilityWrapper
      selectedChannelsCount={selectedChannelsCount}
      allChannelsCount={allChannelsCount}
      openModal={openModal}
    >
      {channels.map(({ id, ...rest }) => (
        <ChannelWithVariantsAvailabilityItemWrapper
          messages={channelsMessages}
          key={id}
          channelsWithVariantsData={channelsWithVariantsData}
          variants={variants}
          channels={channels}
          channelId={id}
        >
          <ChannelContent
            data={channels.find(getById(id))}
            errors={errors}
            messages={channelsMessages[id]}
          />
        </ChannelWithVariantsAvailabilityItemWrapper>
      ))}
    </ChannelsAvailabilityWrapper>
  );
};

export default ChannelsWithVariantsAvailabilityCard;
