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
import { sectionNames } from "@saleor/intl";
import { commonMessages } from "@saleor/intl";
import DeleteShippingRateDialog from "@saleor/shipping/components/DeleteShippingRateDialog";
import ShippingRateZipCodeRangeRemoveDialog from "@saleor/shipping/components/ShippingRateZipCodeRangeRemoveDialog";
import ShippingZoneRatesPage, {
  FormData
} from "@saleor/shipping/components/ShippingZoneRatesPage";
import ShippingZoneZipCodeRangeDialog from "@saleor/shipping/components/ShippingZoneZipCodeRangeDialog";
import {
  getShippingMethodChannelVariables,
  getUpdateShippingPriceRateVariables
} from "@saleor/shipping/handlers";
import {
  useShippingMethodChannelListingUpdate,
  useShippingMethodZipCodeRangeAssign,
  useShippingMethodZipCodeRangeUnassign
} from "@saleor/shipping/mutations";
import {
  useShippingRateDelete,
  useShippingRateUpdate
} from "@saleor/shipping/mutations";
import { useShippingZone } from "@saleor/shipping/queries";
import {
  shippingPriceRatesEditUrl,
  ShippingRateUrlDialog,
  ShippingRateUrlQueryParams,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

export interface PriceRatesUpdateProps {
  id: string;
  rateId: string;
  params: ShippingRateUrlQueryParams;
}

export const PriceRatesUpdate: React.FC<PriceRatesUpdateProps> = ({
  id,
  rateId,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useShippingZone({
    displayLoader: true,
    variables: { id }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateUrlDialog,
    ShippingRateUrlQueryParams
  >(navigate, params => shippingPriceRatesEditUrl(id, rateId, params), params);

  const rate = data?.shippingZone?.shippingMethods.find(
    rate => rate.id === rateId
  );
  const { data: channelsData } = useChannelsList({});

  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts
  ] = useShippingMethodChannelListingUpdate({});

  const [
    assignZipCodeRange,
    assignZipCodeRangeOpts
  ] = useShippingMethodZipCodeRangeAssign({
    onCompleted: data => {
      if (data.shippingMethodZipCodeRulesCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      } else {
        notify({
          status: "error",
          text: intl.formatMessage({
            defaultMessage: "Cannot add specified zip codes range.",
            description: "zip code range add error text"
          })
        });
      }
    }
  });
  const [
    unassignZipCodeRange,
    unassignZipCodeRangeOpts
  ] = useShippingMethodZipCodeRangeUnassign({
    onCompleted: data => {
      if (data.shippingMethodZipCodeRulesDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const shippingChannels = createShippingChannelsFromRate(
    rate?.channelListings
  );
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

  const handleSubmit = async (formData: FormData) => {
    const response = await updateShippingRate({
      variables: getUpdateShippingPriceRateVariables(formData, id, rateId)
    });
    const errors = response.data.shippingPriceUpdate.errors;
    if (errors.length === 0) {
      handleSuccess();
      updateShippingMethodChannelListing({
        variables: getShippingMethodChannelVariables(
          rateId,
          formData.noLimits,
          formData.channelListings,
          shippingChannels
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
          selected={channelListElements.length}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <DeleteShippingRateDialog
        confirmButtonState={deleteShippingRateOpts.status}
        onClose={closeModal}
        handleConfirm={() =>
          deleteShippingRate({
            variables: {
              id: rateId
            }
          })
        }
        open={params.action === "remove"}
        name={rate?.name}
      />
      <ShippingZoneRatesPage
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={
          loading ||
          updateShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading"
        }
        hasChannelChanged={shippingChannels?.length !== currentChannels?.length}
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={() => openModal("remove")}
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
        variant={ShippingMethodTypeEnum.PRICE}
        onZipCodeAssign={() => openModal("add-range")}
        onZipCodeUnassign={id =>
          openModal("remove-range", {
            id
          })
        }
      />
      <ShippingZoneZipCodeRangeDialog
        confirmButtonState={assignZipCodeRangeOpts.status}
        onClose={closeModal}
        onSubmit={data =>
          assignZipCodeRange({
            variables: {
              id: rateId,
              input: {
                zipCodeRules: [
                  {
                    end: data.max || null,
                    start: data.min
                  }
                ]
              }
            }
          })
        }
        open={params.action === "add-range"}
      />
      <ShippingRateZipCodeRangeRemoveDialog
        confirmButtonState={unassignZipCodeRangeOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          unassignZipCodeRange({
            variables: {
              id: params.id
            }
          })
        }
        open={params.action === "remove-range"}
      />
    </>
  );
};

export default PriceRatesUpdate;
