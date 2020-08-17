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
import { sectionNames } from "@saleor/intl";
import { commonMessages } from "@saleor/intl";
import DeleteShippingRateDialog from "@saleor/shipping/components/DeleteShippingRateDialog";
import ShippingZoneRatesPage, {
  FormData
} from "@saleor/shipping/components/ShippingZoneRatesPage";
import {
  useShippingRateDelete,
  useShippingRateUpdate
} from "@saleor/shipping/mutations";
import { useShippingZone } from "@saleor/shipping/queries";
import { shippingZoneUrl } from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import React, { useState } from "react";
import { useIntl } from "react-intl";

export interface PriceRatesUpdateProps {
  id: string;
  rateId: string;
}

export const PriceRatesUpdate: React.FC<PriceRatesUpdateProps> = ({
  id,
  rateId
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const { data, loading } = useShippingZone({
    displayLoader: true,
    variables: { id }
  });

  const rate = data?.shippingZone?.shippingMethods.find(
    rate => rate.id === rateId
  );

  // const { data: channelsData } = useChannelsList({});
  const shippingChannels = createShippingChannels(channelsList1);
  const allChannels = createShippingChannels(channelsList);
  // channelsData?.channels
  const [currentChannels, setCurrentChannels] = useStateFromProps(
    shippingChannels
  );

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

  const [openModal, setOpenModal] = React.useState(false);

  const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate({
    onCompleted: data => {
      if (data.shippingPriceUpdate.errors.length === 0) {
        //   shippingMethodChannelListingUpdate({variables: input: {
        //   id: data.id
        //   addChannels: currentChannels,
        //   removeChannels: ?
        // }})
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });
  const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(shippingZoneUrl(id));
      }
    }
  });

  const handleDelete = () => setOpenModal(true);
  const handleSubmit = (data: FormData) =>
    updateShippingRate({
      variables: {
        id,
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
      <DeleteShippingRateDialog
        confirmButtonState={deleteShippingRateOpts.status}
        onClose={() => setOpenModal(false)}
        handleConfirm={() =>
          deleteShippingRate({
            variables: {
              id: rateId
            }
          })
        }
        open={openModal}
        name={rate?.name}
      />
      <ShippingZoneRatesPage
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        onChannelsChange={setCurrentChannels}
        defaultCurrency={shop?.defaultCurrency}
        disabled={loading}
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onBack={handleBack}
        rate={rate}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
        openChannelsModal={() => setChannelsModalOpen(true)}
        variant={ShippingMethodTypeEnum.PRICE}
      />
    </>
  );
};

export default PriceRatesUpdate;
