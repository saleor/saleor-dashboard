import { useChannelsList } from "@saleor/channels/queries";
import { createSortedShippingChannels } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { ShippingMethodFragment_zipCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages, sectionNames } from "@saleor/intl";
import ShippingRateZipCodeRangeRemoveDialog from "@saleor/shipping/components/ShippingRateZipCodeRangeRemoveDialog";
import { FormData } from "@saleor/shipping/components/ShippingZoneRatesPage";
import ShippingZoneRatesPage from "@saleor/shipping/components/ShippingZoneRatesPage";
import ShippingZoneZipCodeRangeDialog from "@saleor/shipping/components/ShippingZoneZipCodeRangeDialog";
import {
  getCreateShippingPriceRateVariables,
  getShippingMethodChannelVariables
} from "@saleor/shipping/handlers";
import { useShippingMethodChannelListingUpdate } from "@saleor/shipping/mutations";
import { useShippingRateCreate } from "@saleor/shipping/mutations";
import {
  shippingPriceRatesEditUrl,
  shippingPriceRatesUrl,
  ShippingRateCreateUrlDialog,
  ShippingRateCreateUrlQueryParams,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import { MinMax } from "@saleor/types";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { remove } from "@saleor/utils/lists";
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
  const notify = useNotifier();
  const intl = useIntl();

  const [zipCodes, setZipCodes] = React.useState<
    ShippingMethodFragment_zipCodeRules[]
  >([]);

  const { data: channelsData, loading: channelsLoading } = useChannelsList({});

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateCreateUrlDialog,
    ShippingRateCreateUrlQueryParams
  >(navigate, params => shippingPriceRatesUrl(id, params), params);

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
        rate={null}
        zipCodes={zipCodes}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onZipCodeAssign={() => openModal("add-range")}
        onZipCodeUnassign={id =>
          openModal("remove-range", {
            id
          })
        }
        variant={ShippingMethodTypeEnum.PRICE}
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

export default PriceRatesCreate;
