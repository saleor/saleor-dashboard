import { useChannelsList } from "@saleor/channels/queries";
import { createSortedShippingChannels } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages, sectionNames } from "@saleor/intl";
import { FormData } from "@saleor/shipping/components/ShippingZoneRatesPage";
import ShippingZoneRatesPage from "@saleor/shipping/components/ShippingZoneRatesPage";
import {
  getCreateShippingPriceRateVariables,
  getShippingMethodChannelVariables
} from "@saleor/shipping/handlers";
import { useShippingMethodChannelListingUpdate } from "@saleor/shipping/mutations";
import { useShippingRateCreate } from "@saleor/shipping/mutations";
import {
  shippingPriceRatesEditUrl,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

export interface PriceRatesCreateProps {
  id: string;
}

export const PriceRatesCreate: React.FC<PriceRatesCreateProps> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data: channelsData, loading: channelsLoading } = useChannelsList({});

  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts
  ] = useShippingMethodChannelListingUpdate({
    onCompleted: data => {
      const errors = data.shippingMethodChannelListingUpdate.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(
          shippingPriceRatesEditUrl(
            id,
            data.shippingMethodChannelListingUpdate.shippingMethod.id
          )
        );
      }
    }
  });

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
  } = useChannels(allChannels);

  const [createShippingRate, createShippingRateOpts] = useShippingRateCreate(
    {}
  );

  const handleSubmit = async (data: FormData) => {
    const response = await createShippingRate({
      variables: getCreateShippingPriceRateVariables(data, id)
    });
    const errors = response.data.shippingPriceCreate.errors;
    if (errors.length === 0) {
      updateShippingMethodChannelListing({
        variables: getShippingMethodChannelVariables(
          response.data.shippingPriceCreate.shippingMethod.id,
          data.noLimits,
          data.channelListings
        )
      });
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
            defaultMessage: "Manage Channel Availability"
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}

      <ShippingZoneRatesPage
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={
          channelsLoading ||
          createShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading"
        }
        saveButtonBarState={createShippingRateOpts?.status}
        onSubmit={handleSubmit}
        onBack={handleBack}
        errors={createShippingRateOpts.data?.shippingPriceCreate.errors || []}
        channelErrors={
          updateShippingMethodChannelListingOpts?.data
            ?.shippingMethodChannelListingUpdate?.errors || []
        }
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        variant={ShippingMethodTypeEnum.PRICE}
      />
    </>
  );
};

export default PriceRatesCreate;
