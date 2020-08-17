import { channelsList, channelsList1 } from "@saleor/channels/fixtures";
// import { useChannelsList } from "@saleor/channels/queries";
import {
  ChannelShippingData,
  createShippingChannels
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages } from "@saleor/intl";
import { sectionNames } from "@saleor/intl";
import { FormData } from "@saleor/shipping/components/ShippingZoneRatesPage";
import ShippingZoneRatesPage from "@saleor/shipping/components/ShippingZoneRatesPage";
import { useShippingRateCreate } from "@saleor/shipping/mutations";
import { shippingZoneUrl } from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import React, { useState } from "react";
import { useIntl } from "react-intl";

export interface PriceRatesCreateProps {
  id: string;
}

export const PriceRatesCreate: React.FC<PriceRatesCreateProps> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  //  const {
  //    data: channelsData
  //  } = useChannelsList(
  //    {}
  //  );
  const shippingChannels = createShippingChannels(channelsList1);
  const allChannels = createShippingChannels(channelsList); // channelsData?.channels
  const [currentChannels, setCurrentChannels] = useStateFromProps<
    ChannelShippingData[]
  >(shippingChannels);

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<ChannelShippingData>(
    currentChannels,
    (a, b) => a.id === b.id
  );

  const [isChannelsModalOpen, setChannelsModalOpen] = useState(false);

  const handleChannelsModalClose = () => {
    setChannelsModalOpen(false);
    setChannels(currentChannels);
  };

  const handleChannelsConfirm = () => {
    setCurrentChannels(channelListElements);
    setChannelsModalOpen(false);
  };

  const [createShippingRate, createShippingRateOpts] = useShippingRateCreate({
    onCompleted: data => {
      if (data.shippingPriceCreate.errors.length === 0) {
        // shippingMethodChannelListingCreate({variables: input: {
        //   id: data.id
        //   addChannels: currentChannels
        // }})
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const handleSubmit = (data: FormData) =>
    createShippingRate({
      variables: {
        input: {
          name: data.name,
          shippingZone: id,
          type: ShippingMethodTypeEnum.PRICE
        }
      }
    });

  const handleBack = () => navigate(shippingZoneUrl(id));

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Channel Availability"
          })}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
        />
      )}

      <ShippingZoneRatesPage
        allChannelsCount={allChannels?.length}
        onChannelsChange={(data: ChannelShippingData[]) =>
          setCurrentChannels(data)
        }
        defaultCurrency={shop?.defaultCurrency}
        shippingChannels={currentChannels}
        disabled={false}
        saveButtonBarState={createShippingRateOpts?.status}
        onSubmit={handleSubmit}
        onBack={handleBack}
        errors={createShippingRateOpts.data?.shippingPriceCreate.errors || []}
        openChannelsModal={() => setChannelsModalOpen(true)}
        variant={ShippingMethodTypeEnum.PRICE}
      />
    </>
  );
};

export default PriceRatesCreate;
