import { useChannelsList } from "@saleor/channels/queries";
import {
  ChannelShippingData,
  createShippingChannels
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { sectionNames } from "@saleor/intl";
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
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import React from "react";
import { useIntl } from "react-intl";

export interface PriceRatesCreateProps {
  id: string;
}

export const PriceRatesCreate: React.FC<PriceRatesCreateProps> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const { data: channelsData, loading: channelsLoading } = useChannelsList({});

  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts
  ] = useShippingMethodChannelListingUpdate({
    onCompleted: data => {
      const errors = data.shippingMethodChannelListingUpdate.errors;
      if (errors.length === 0) {
        navigate(
          shippingPriceRatesEditUrl(
            id,
            data.shippingMethodChannelListingUpdate.shippingMethod.id
          )
        );
      } else {
        errors.map(err =>
          notify({ status: "error", text: getShippingErrorMessage(err, intl) })
        );
      }
    }
  });

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
  } = useChannels(allChannels);

  const [createShippingRate, createShippingRateOpts] = useShippingRateCreate({
    onCompleted: data => {
      const errors = data.shippingPriceCreate.errors;
      if (errors.length === 0) {
        updateShippingMethodChannelListing({
          variables: getShippingMethodChannelVariables(
            data.shippingPriceCreate.shippingMethod.id,
            currentChannels
          )
        });
      } else {
        errors.map(err =>
          notify({ status: "error", text: getShippingErrorMessage(err, intl) })
        );
      }
    }
  });

  const handleSubmit = (data: FormData) =>
    createShippingRate({
      variables: getCreateShippingPriceRateVariables(data, id)
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
        disabled={
          channelsLoading ||
          createShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading"
        }
        saveButtonBarState={createShippingRateOpts?.status}
        onSubmit={handleSubmit}
        onBack={handleBack}
        errors={createShippingRateOpts.data?.shippingPriceCreate.errors || []}
        openChannelsModal={handleChannelsModalOpen}
        variant={ShippingMethodTypeEnum.PRICE}
      />
    </>
  );
};

export default PriceRatesCreate;
