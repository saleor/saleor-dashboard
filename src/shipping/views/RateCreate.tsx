// @ts-strict-ignore
import { createSortedShippingChannels } from "@dashboard/channels/utils";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { PostalCodeRuleInclusionTypeEnum, useShippingZoneChannelsQuery } from "@dashboard/graphql";
import useChannels from "@dashboard/hooks/useChannels";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import ShippingZonePostalCodeRangeDialog from "@dashboard/shipping/components/ShippingZonePostalCodeRangeDialog";
import ShippingZoneRatesCreatePage from "@dashboard/shipping/components/ShippingZoneRatesCreatePage";
import { useShippingRateCreator } from "@dashboard/shipping/handlers";
import {
  shippingRateCreateUrl,
  ShippingRateCreateUrlDialog,
  ShippingRateCreateUrlQueryParams,
  shippingZoneUrl,
} from "@dashboard/shipping/urls";
import postalCodesReducer from "@dashboard/shipping/views/reducer";
import {
  filterPostalCodes,
  getPostalCodeRuleByMinMax,
  getRuleObject,
} from "@dashboard/shipping/views/utils";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { MinMax } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

const FORM_ID = Symbol("shipping-zone-rates-create-form-id");

export interface RateCreateProps {
  id: string;
  params: ShippingRateCreateUrlQueryParams;
}

export const RateCreate = ({ id, params }: RateCreateProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateCreateUrlDialog,
    ShippingRateCreateUrlQueryParams
  >(navigate, params => shippingRateCreateUrl(id, params), params);
  const { data: shippingZoneData, loading: channelsLoading } = useShippingZoneChannelsQuery({
    displayLoader: true,
    variables: { id },
  });
  const { taxClasses, fetchMoreTaxClasses } = useTaxClassFetchMore();
  const allChannels = createSortedShippingChannels(shippingZoneData?.shippingZone?.channels);
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
    toggleAllChannels,
  } = useChannels(allChannels, params?.action, { closeModal, openModal }, { formId: FORM_ID });
  const [state, dispatch] = React.useReducer(postalCodesReducer, {
    codesToDelete: [],
    havePostalCodesChanged: false,
    inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
    originalCodes: [],
    postalCodeRules: [],
  });
  const { channelErrors, createShippingRate, errors, status } = useShippingRateCreator(
    id,
    params.type,
    state.postalCodeRules,
    state.inclusionType,
  );
  const onPostalCodeAssign = (rule: MinMax) => {
    if (state.postalCodeRules.filter(getPostalCodeRuleByMinMax(rule)).length > 0) {
      closeModal();

      return;
    }

    const newCode = getRuleObject(rule, state.inclusionType);

    dispatch({
      havePostalCodesChanged: true,
      postalCodeRules: [...state.postalCodeRules, newCode],
    });
    closeModal();
  };
  const onPostalCodeInclusionChange = (inclusion: PostalCodeRuleInclusionTypeEnum) => {
    dispatch({
      inclusionType: inclusion,
      postalCodeRules: [],
    });
  };
  const onPostalCodeUnassign = code => {
    dispatch({
      havePostalCodesChanged: true,
      postalCodeRules: filterPostalCodes(state.postalCodeRules, code),
    });
  };

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            id: "EM730i",
            defaultMessage: "Manage Channel Availability",
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}

      <ShippingZoneRatesCreatePage
        formId={FORM_ID}
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={channelsLoading || status === "loading"}
        saveButtonBarState={status}
        onSubmit={createShippingRate}
        backUrl={shippingZoneUrl(id)}
        errors={errors}
        channelErrors={channelErrors}
        postalCodes={state.postalCodeRules}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onPostalCodeAssign={() => openModal("add-range")}
        onPostalCodeUnassign={onPostalCodeUnassign}
        onPostalCodeInclusionChange={onPostalCodeInclusionChange}
        variant={params.type}
        taxClasses={taxClasses ?? []}
        fetchMoreTaxClasses={fetchMoreTaxClasses}
      />
      <ShippingZonePostalCodeRangeDialog
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPostalCodeAssign}
        open={params.action === "add-range"}
      />
    </>
  );
};

export default RateCreate;
