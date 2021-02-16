import { useChannelsList } from "@saleor/channels/queries";
import { createSortedShippingChannels } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { ShippingMethodFragment_postalCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import ShippingZonePostalCodeRangeDialog from "@saleor/shipping/components/ShippingZonePostalCodeRangeDialog";
import ShippingZoneRatesCreatePage from "@saleor/shipping/components/ShippingZoneRatesCreatePage";
import { useShippingRateCreator } from "@saleor/shipping/handlers";
import {
  shippingPriceRatesUrl,
  ShippingRateCreateUrlDialog,
  ShippingRateCreateUrlQueryParams,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import { MinMax } from "@saleor/types";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

export interface PriceRatesCreateProps {
  id: string;
  params: ShippingRateCreateUrlQueryParams;
}

export const PriceRatesCreate: React.FC<PriceRatesCreateProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const intl = useIntl();

  const [postalCodes, setPostalCodes] = React.useState<
    ShippingMethodFragment_postalCodeRules[]
  >([]);

  const { data: channelsData, loading: channelsLoading } = useChannelsList({});

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateCreateUrlDialog,
    ShippingRateCreateUrlQueryParams
  >(navigate, params => shippingPriceRatesUrl(id, params), params);

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
  } = useChannels(allChannels, params?.action, { closeModal, openModal });

  const {
    channelErrors,
    createShippingRate,
    errors,
    status
  } = useShippingRateCreator(id, ShippingMethodTypeEnum.PRICE, postalCodes);

  const handleBack = () => navigate(shippingZoneUrl(id));

  const handlePostalCodeRangeAdd = (data: MinMax) => {
    setPostalCodes(postalCodes => [
      ...postalCodes,
      {
        __typename: "ShippingMethodPostalCodeRule",
        end: data.max,
        id: postalCodes.length.toString(),
        start: data.min
      }
    ]);
    closeModal();
  };

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

      <ShippingZoneRatesCreatePage
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={channelsLoading || status === "loading"}
        saveButtonBarState={status}
        onSubmit={createShippingRate}
        onBack={handleBack}
        errors={errors}
        channelErrors={channelErrors}
        postalCodes={postalCodes}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onPostalCodeAssign={() => openModal("add-range")}
        onPostalCodeUnassign={id =>
          console.log("unassign postcode")
        }
        variant={ShippingMethodTypeEnum.PRICE}
      />
      <ShippingZonePostalCodeRangeDialog
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handlePostalCodeRangeAdd}
        open={params.action === "add-range"}
      />
    </>
  );
};

export default PriceRatesCreate;
