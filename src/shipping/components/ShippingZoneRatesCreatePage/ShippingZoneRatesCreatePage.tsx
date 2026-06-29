// @ts-strict-ignore
import { type ChannelShippingData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type WithFormId } from "@dashboard/components/Form";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import {
  PermissionEnum,
  type PostalCodeRuleInclusionTypeEnum,
  type ShippingChannelsErrorFragment,
  type ShippingErrorFragment,
  ShippingMethodTypeEnum,
  type ShippingMethodTypeFragment,
  type TaxClassBaseFragment,
} from "@dashboard/graphql";
import useForm, { type SubmitPromise } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import useNavigator from "@dashboard/hooks/useNavigator";
import { handleTaxClassChange } from "@dashboard/productTypes/handlers";
import OrderValue from "@dashboard/shipping/components/OrderValue";
import OrderWeight from "@dashboard/shipping/components/OrderWeight";
import PricingCard from "@dashboard/shipping/components/PricingCard";
import ShippingRateInfo from "@dashboard/shipping/components/ShippingRateInfo";
import { useShippingRateChannels } from "@dashboard/shipping/hooks/useShippingRateChannels";
import { useShippingRateEditChanges } from "@dashboard/shipping/hooks/useShippingRateEditChanges";
import { type FetchMoreProps } from "@dashboard/types";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type FormEventHandler, useLayoutEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { ShippingMethodChannelAvailabilityCard } from "../ShippingMethodChannelAvailabilityCard/ShippingMethodChannelAvailabilityCard";
import { ShippingMethodTaxes } from "../ShippingMethodTaxes/ShippingMethodTaxes";
import ShippingZonePostalCodes from "../ShippingZonePostalCodes";
import { type ShippingZoneRateCommonFormData } from "../ShippingZoneRatesPage/types";

interface ShippingZoneRatesCreatePageProps extends WithFormId {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  hasPostalCodeChanges?: boolean;
  disabled: boolean;
  postalCodes?: ShippingMethodTypeFragment["postalCodeRules"];
  postalCodeInclusionType?: PostalCodeRuleInclusionTypeEnum;
  channelErrors: ShippingChannelsErrorFragment[];
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  backUrl: string;
  shippingZoneName?: string;
  onDelete?: () => void;
  onSubmit: (data: ShippingZoneRateCommonFormData) => SubmitPromise;
  onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
  onPostalCodeAssign: () => void;
  onPostalCodeUnassign: (code: any) => void;
  onChannelsChange: (data: ChannelShippingData[]) => void;
  openChannelsModal: () => void;
  variant: ShippingMethodTypeEnum;
  taxClasses: TaxClassBaseFragment[];
  fetchMoreTaxClasses: FetchMoreProps;
}

const ShippingZoneRatesCreatePage = ({
  allChannelsCount,
  shippingChannels,
  hasPostalCodeChanges = false,
  channelErrors,
  disabled,
  errors,
  backUrl,
  shippingZoneName,
  onDelete,
  onSubmit,
  onPostalCodeInclusionChange,
  onChannelsChange,
  onPostalCodeAssign,
  onPostalCodeUnassign,
  openChannelsModal,
  saveButtonBarState,
  variant,
  postalCodes,
  postalCodeInclusionType,
  formId,
  taxClasses,
  fetchMoreTaxClasses,
}: ShippingZoneRatesCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
  const initialForm: ShippingZoneRateCommonFormData = {
    channelListings: [],
    maxDays: "",
    maxValue: "",
    minDays: "",
    minValue: "",
    name: "",
    description: null,
    type: null,
    taxClassId: "",
  };
  const [taxClassDisplayName, setTaxClassDisplayName] = useState("");
  const {
    change,
    data: formData,
    setIsSubmitDisabled,
    triggerChange,
  } = useForm(initialForm, undefined, { confirmLeave: true, formId });
  const { setExitDialogSubmitRef, setIsDirty } = useExitFormDialog({ formId });
  const { handleChannelsChange, hasValidChannelPrices, pricedChannelIdsList } =
    useShippingRateChannels({
      shippingChannels,
      onChannelsChange,
      triggerChange,
    });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const richText = useRichText({
    initial: null,
    triggerChange,
  });

  const hasChanges = useShippingRateEditChanges({
    formData,
    initialFormData: initialForm,
    shippingChannels,
    savedShippingChannels: [],
    hasPostalCodeChanges,
    isDescriptionDirty: richText.isDirty,
  });

  const data: ShippingZoneRateCommonFormData = {
    ...formData,
    description: null,
  };
  const getData = async (): Promise<ShippingZoneRateCommonFormData> => ({
    ...formData,
    channelListings: shippingChannels,
    description: await richText.getValue(),
  });
  const handleFormElementSubmit: FormEventHandler = async event => {
    event.preventDefault();
    handleFormSubmit(await getData());
  };
  const handleSubmit = async () => handleFormSubmit(await getData());

  useLayoutEffect(
    function registerExitDialogSubmit() {
      setExitDialogSubmitRef(handleSubmit);
    },
    [handleSubmit, setExitDialogSubmitRef],
  );

  useLayoutEffect(() => {
    setIsDirty(hasChanges);
  });

  const isSaveDisabled = disabled || !hasValidChannelPrices;
  const pageTitle = useMemo(
    () =>
      isPriceVariant
        ? intl.formatMessage({
            id: "RXPGi/",
            defaultMessage: "Price Rate Create",
            description: "page title",
          })
        : intl.formatMessage({
            id: "NDm2Fe",
            defaultMessage: "Weight Rate Create",
            description: "page title",
          }),
    [intl, isPriceVariant],
  );

  setIsSubmitDisabled(isSaveDisabled);

  return (
    <RichTextContext.Provider value={richText}>
      <form onSubmit={handleFormElementSubmit}>
        <DetailPageLayout>
          <TopNav
            href={backUrl}
            title={
              !shippingZoneName ? (
                <Skeleton __width="200px" />
              ) : (
                <Box display="flex" alignItems="center" gap={1}>
                  <Text
                    size={6}
                    color="default2"
                    ellipsis
                    __maxWidth="200px"
                    title={shippingZoneName}
                  >
                    {shippingZoneName}
                  </Text>
                  <Text size={6} color="default2">
                    /
                  </Text>
                  <Text size={6}>{pageTitle}</Text>
                </Box>
              )
            }
          />
          <DetailPageLayout.Content>
            <ShippingRateInfo data={data} disabled={disabled} errors={errors} onChange={change} />
            <CardSpacer />
            <PricingCard
              channels={shippingChannels}
              onChange={handleChannelsChange}
              disabled={disabled}
              errors={channelErrors}
            />
            <CardSpacer />
            {isPriceVariant ? (
              <OrderValue
                channels={shippingChannels}
                errors={channelErrors}
                disabled={disabled}
                onChannelsChange={handleChannelsChange}
              />
            ) : (
              <OrderWeight
                disabled={disabled}
                minValue={data.minValue}
                maxValue={data.maxValue}
                onChange={change}
                errors={errors}
              />
            )}
            <CardSpacer />
            <ShippingZonePostalCodes
              disabled={disabled}
              inclusionType={postalCodeInclusionType}
              onPostalCodeDelete={onPostalCodeUnassign}
              onPostalCodeInclusionChange={onPostalCodeInclusionChange}
              onPostalCodeRangeAdd={onPostalCodeAssign}
              postalCodes={postalCodes}
            />
            <CardSpacer />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <ShippingMethodChannelAvailabilityCard
              channels={shippingChannels}
              pricedChannelIds={pricedChannelIdsList}
              totalChannelsCount={allChannelsCount ?? 0}
              errors={channelErrors}
              managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
              onManageClick={openChannelsModal}
            />
            <CardSpacer />
            <ShippingMethodTaxes
              value={formData.taxClassId}
              taxClassDisplayName={taxClassDisplayName}
              taxClasses={taxClasses}
              disabled={false}
              onChange={event =>
                handleTaxClassChange(event, taxClasses, change, setTaxClassDisplayName)
              }
              onFetchMore={fetchMoreTaxClasses}
            />
          </DetailPageLayout.RightSidebar>
          <Savebar>
            {onDelete && <Savebar.DeleteButton onClick={onDelete} />}
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(backUrl)} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={handleSubmit}
              disabled={isSaveDisabled}
              tooltip={
                !hasValidChannelPrices &&
                intl.formatMessage({
                  id: "lCEp2/",
                  defaultMessage: "Set prices for all channels to save",
                  description: "save button disabled tooltip",
                })
              }
            />
          </Savebar>
        </DetailPageLayout>
      </form>
    </RichTextContext.Provider>
  );
};

export default ShippingZoneRatesCreatePage;
