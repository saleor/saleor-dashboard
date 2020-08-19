import { useChannelsList } from "@saleor/channels/queries";
import {
  createShippingChannels,
  createShippingChannelsFromRate
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { sectionNames } from "@saleor/intl";
import { commonMessages } from "@saleor/intl";
import DeleteShippingRateDialog from "@saleor/shipping/components/DeleteShippingRateDialog";
import ShippingZoneRatesPage, {
  FormData
} from "@saleor/shipping/components/ShippingZoneRatesPage";
import { useShippingMethodChannelListingUpdate } from "@saleor/shipping/mutations";
import {
  useShippingRateDelete,
  useShippingRateUpdate
} from "@saleor/shipping/mutations";
import { useShippingZone } from "@saleor/shipping/queries";
import { shippingZoneUrl } from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import { diff } from "fast-array-diff";
import React from "react";
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
  const { data: channelsData } = useChannelsList({});

  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts
  ] = useShippingMethodChannelListingUpdate({
    onCompleted: data => {
      const errors = data.shippingMethodChannelListingUpdate.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Channels saved",
            description: "notification text"
          })
        });
      } else {
        errors.map(err =>
          notify({
            status: "error",
            text: getShippingErrorMessage(err, intl)
          })
        );
      }
    }
  });

  const shippingChannels = createShippingChannelsFromRate(rate?.channels);
  const allChannels = createShippingChannels(channelsData?.channels);

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels
  } = useChannels(shippingChannels);

  const [openModal, setOpenModal] = React.useState(false);

  const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate({
    onCompleted: data => {
      const errors = data.shippingPriceUpdate.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });

        const diffChannels = diff(
          shippingChannels,
          currentChannels,
          (a, b) => a.id === b.id
        );

        if (diffChannels.removed.length || diffChannels.added.length) {
          updateShippingMethodChannelListing({
            variables: {
              id: rateId,
              input: {
                addChannels: currentChannels.map(channel => ({
                  channelId: channel.id,
                  maxValue: channel.maxValue,
                  minValue: channel.minValue,
                  price: channel.price
                })),
                removeChannels: diffChannels.removed?.map(
                  removedChannel => removedChannel.id
                )
              }
            }
          });
        }
      } else {
        errors.map(err =>
          notify({
            status: "error",
            text: getShippingErrorMessage(err, intl)
          })
        );
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
  const handleSubmit = (formData: FormData) =>
    updateShippingRate({
      variables: {
        id: rateId,
        input: {
          maximumOrderPrice: parseFloat(formData.maxValue),
          minimumOrderPrice: parseFloat(formData.minValue),
          name: formData.name,
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
        disabled={
          loading ||
          updateShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading"
        }
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onBack={handleBack}
        rate={rate}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
        openChannelsModal={handleChannelsModalOpen}
        variant={ShippingMethodTypeEnum.PRICE}
      />
    </>
  );
};

export default PriceRatesUpdate;
