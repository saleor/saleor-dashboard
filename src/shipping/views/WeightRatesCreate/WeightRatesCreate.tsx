import { useChannelsList } from "@saleor/channels/queries";
import {
  createShippingChannels,
  createSortedShippingChannels
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { ShippingMethodFragment_zipCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import ShippingRateZipCodeRangeRemoveDialog from "@saleor/shipping/components/ShippingRateZipCodeRangeRemoveDialog";
import ShippingZoneRatesCreatePage from "@saleor/shipping/components/ShippingZoneRatesCreatePage";
import ShippingZoneZipCodeRangeDialog from "@saleor/shipping/components/ShippingZoneZipCodeRangeDialog";
import { useShippingRateCreator } from "@saleor/shipping/handlers";
import {
  ShippingRateCreateUrlDialog,
  ShippingRateCreateUrlQueryParams,
  shippingWeightRatesUrl,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import { MinMax } from "@saleor/types";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { remove } from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";

export interface WeightRatesCreateProps {
  id: string;
  params: ShippingRateCreateUrlQueryParams;
}

export const WeightRatesCreate: React.FC<WeightRatesCreateProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const intl = useIntl();

  const [zipCodes, setZipCodes] = React.useState<
    ShippingMethodFragment_zipCodeRules[]
  >([]);

  const { data: channelsData, loading: channelsLoading } = useChannelsList({});

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateCreateUrlDialog,
    ShippingRateCreateUrlQueryParams
  >(navigate, params => shippingWeightRatesUrl(id, params), params);

  const shippingChannels = createShippingChannels(channelsData?.channels);
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
  } = useChannels(shippingChannels, params?.action, { closeModal, openModal });

  const {
    channelErrors,
    createShippingRate,
    errors,
    status
  } = useShippingRateCreator(id, ShippingMethodTypeEnum.WEIGHT, zipCodes);

  const handleBack = () => navigate(shippingZoneUrl(id));

  const handleZipCodeRangeAdd = (data: MinMax) => {
    setZipCodes(zipCodes => [
      ...zipCodes,
      {
        __typename: "ShippingMethodZipCodeRule",
        end: data.max,
        id: zipCodes.length.toString(),
        start: data.min
      }
    ]);
    closeModal();
  };
  const handleZipCodeRangeDelete = (id: string) => {
    setZipCodes(zipCodes =>
      remove(
        zipCodes.find(zipCode => zipCode.id === id),
        zipCodes,
        (a, b) => a.id === b.id
      )
    );
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
            defaultMessage: "Manage Channels Availability"
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
        zipCodes={zipCodes}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onZipCodeAssign={() => openModal("add-range")}
        onZipCodeUnassign={id =>
          openModal("remove-range", {
            id
          })
        }
        variant={ShippingMethodTypeEnum.WEIGHT}
      />
      <ShippingZoneZipCodeRangeDialog
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleZipCodeRangeAdd}
        open={params.action === "add-range"}
      />
      <ShippingRateZipCodeRangeRemoveDialog
        confirmButtonState="default"
        onClose={closeModal}
        onConfirm={() => handleZipCodeRangeDelete(params.id)}
        open={params.action === "remove-range"}
      />
    </>
  );
};

export default WeightRatesCreate;
