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
import { shippingMethodChannelsDialogMessages } from "@dashboard/shipping/messages/channelAvailabilityDialogMessages";
import {
  shippingRateCreateUrl,
  type ShippingRateCreateUrlDialog,
  type ShippingRateCreateUrlQueryParams,
  shippingZoneUrl,
} from "@dashboard/shipping/urls";
import { hasPostalCodeStateChanges } from "@dashboard/shipping/utils/postalCodeState";
import postalCodesReducer from "@dashboard/shipping/views/reducer";
import {
  filterPostalCodes,
  getPostalCodeRuleByMinMax,
  getRuleObject,
  mapPostalCodeRulesInclusionType,
} from "@dashboard/shipping/views/utils";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { type MinMax } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useMemo, useReducer } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const FORM_ID = Symbol("shipping-zone-rates-create-form-id");

interface RateCreateProps {
  id: string;
  params: ShippingRateCreateUrlQueryParams;
}

const RateCreate = ({ id, params }: RateCreateProps) => {
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
  const zoneName = shippingZoneData?.shippingZone?.name;
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
  const [state, dispatch] = useReducer(postalCodesReducer, {
    codesToDelete: [],
    inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
    originalCodes: [],
    postalCodeRules: [],
  });
  const savedPostalCodeState = useMemo(
    () => ({
      codesToDelete: [],
      inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
      postalCodeRules: [],
    }),
    [],
  );
  const hasPostalCodeChanges = useMemo(
    () =>
      hasPostalCodeStateChanges(
        {
          codesToDelete: state.codesToDelete,
          inclusionType: state.inclusionType,
          postalCodeRules: state.postalCodeRules,
        },
        savedPostalCodeState,
      ),
    [savedPostalCodeState, state.codesToDelete, state.inclusionType, state.postalCodeRules],
  );
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
      postalCodeRules: [...state.postalCodeRules, newCode],
    });
    closeModal();
  };
  const onPostalCodeInclusionChange = (inclusion: PostalCodeRuleInclusionTypeEnum) => {
    dispatch({
      inclusionType: inclusion,
      postalCodeRules: mapPostalCodeRulesInclusionType(state.postalCodeRules, inclusion),
    });
  };
  const onPostalCodeUnassign = code => {
    dispatch({
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
          title={intl.formatMessage(shippingMethodChannelsDialogMessages.title)}
          description={
            zoneName ? (
              <FormattedMessage
                {...shippingMethodChannelsDialogMessages.description}
                values={{ zoneName }}
              />
            ) : undefined
          }
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
        shippingZoneName={zoneName}
        errors={errors}
        channelErrors={channelErrors}
        postalCodes={state.postalCodeRules}
        postalCodeInclusionType={state.inclusionType}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onPostalCodeAssign={() => openModal("add-range")}
        onPostalCodeUnassign={onPostalCodeUnassign}
        onPostalCodeInclusionChange={onPostalCodeInclusionChange}
        hasPostalCodeChanges={hasPostalCodeChanges}
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
