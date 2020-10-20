import { useChannelsList } from "@saleor/channels/queries";
import {
  createShippingChannelsFromRate,
  createSortedShippingChannels
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
import {
  getShippingMethodChannelVariables,
  getUpdateShippingWeightRateVariables
} from "@saleor/shipping/handlers";
import {
  useShippingRateDelete,
  useShippingRateUpdate
} from "@saleor/shipping/mutations";
import { useShippingMethodChannelListingUpdate } from "@saleor/shipping/mutations";
import { useShippingZone } from "@saleor/shipping/queries";
import { shippingZoneUrl } from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import React from "react";
import { useIntl } from "react-intl";

export interface WeightRatesUpdateProps {
  id: string;
  rateId: string;
}

export const WeightRatesUpdate: React.FC<WeightRatesUpdateProps> = ({
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
  ] = useShippingMethodChannelListingUpdate({});
  const shippingChannels = createShippingChannelsFromRate(rate?.channelListing);
  const allChannels = createSortedShippingChannels(channelsData?.channels);

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels
  } = useChannels(shippingChannels);

  const [openModal, setOpenModal] = React.useState(false);

  const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate(
    {}
  );

  const handleSuccess = () => {
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges)
    });
  };

  const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        handleSuccess();
        navigate(shippingZoneUrl(id));
      }
    }
  });

  const handleDelete = () => setOpenModal(true);
  const handleSubmit = async (data: FormData) => {
    const response = await updateShippingRate({
      variables: getUpdateShippingWeightRateVariables(data, id, rateId)
    });
    const errors = response.data.shippingPriceUpdate.errors;
    if (errors.length === 0) {
      handleSuccess();
      updateShippingMethodChannelListing({
        variables: getShippingMethodChannelVariables(
          rateId,
          data.noLimits,
          data.channelListing,
          shippingChannels
        )
      });
    } else {
      errors.map(err =>
        notify({
          status: "error",
          text: getShippingErrorMessage(err, intl)
        })
      );
    }
  };

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
            defaultMessage: "Manage Channels Availability"
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
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
        defaultCurrency={shop?.defaultCurrency}
        disabled={
          loading ||
          updateShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading"
        }
        hasChannelChanged={shippingChannels?.length !== currentChannels?.length}
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onBack={handleBack}
        rate={rate}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
        channelErrors={
          updateShippingMethodChannelListingOpts?.data
            ?.shippingMethodChannelListingUpdate?.errors || []
        }
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        variant={ShippingMethodTypeEnum.WEIGHT}
      />
    </>
  );
};

export default WeightRatesUpdate;
