// @ts-strict-ignore
import { ChannelShippingData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { WithFormId } from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import {
  PermissionEnum,
  PostalCodeRuleInclusionTypeEnum,
  ShippingChannelsErrorFragment,
  ShippingErrorFragment,
  ShippingMethodTypeEnum,
  ShippingMethodTypeFragment,
  TaxClassBaseFragment,
} from "@dashboard/graphql";
import useForm, { SubmitPromise } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import useNavigator from "@dashboard/hooks/useNavigator";
import { validatePrice } from "@dashboard/products/utils/validation";
import { handleTaxClassChange } from "@dashboard/productTypes/handlers";
import OrderValue from "@dashboard/shipping/components/OrderValue";
import OrderWeight from "@dashboard/shipping/components/OrderWeight";
import PricingCard from "@dashboard/shipping/components/PricingCard";
import ShippingRateInfo from "@dashboard/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@dashboard/shipping/handlers";
import { FetchMoreProps } from "@dashboard/types";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React, { FormEventHandler } from "react";
import { useIntl } from "react-intl";

import ShippingMethodTaxes from "../ShippingMethodTaxes";
import ShippingZonePostalCodes from "../ShippingZonePostalCodes";
import { ShippingZoneRateCommonFormData } from "../ShippingZoneRatesPage/types";

export interface ShippingZoneRatesCreatePageProps extends WithFormId {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  disabled: boolean;
  postalCodes?: ShippingMethodTypeFragment["postalCodeRules"];
  channelErrors: ShippingChannelsErrorFragment[];
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  backUrl: string;
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

export const ShippingZoneRatesCreatePage: React.FC<ShippingZoneRatesCreatePageProps> = ({
  allChannelsCount,
  shippingChannels,
  channelErrors,
  disabled,
  errors,
  backUrl,
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
  formId,
  taxClasses,
  fetchMoreTaxClasses,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
  const initialForm: ShippingZoneRateCommonFormData = {
    channelListings: shippingChannels,
    maxDays: "",
    maxValue: "",
    minDays: "",
    minValue: "",
    name: "",
    description: null,
    orderValueRestricted: true,
    type: null,
    taxClassId: "",
  };
  const [taxClassDisplayName, setTaxClassDisplayName] = React.useState("");
  const {
    change,
    data: formData,
    setIsSubmitDisabled,
    triggerChange,
  } = useForm(initialForm, undefined, { confirmLeave: true, formId });
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const richText = useRichText({
    initial: null,
    triggerChange,
  });
  const data: ShippingZoneRateCommonFormData = {
    ...formData,
    description: null,
  };
  const getData = async (): Promise<ShippingZoneRateCommonFormData> => ({
    ...formData,
    description: await richText.getValue(),
  });
  const handleFormElementSubmit: FormEventHandler = async event => {
    event.preventDefault();
    handleFormSubmit(await getData());
  };
  const handleSubmit = async () => handleFormSubmit(await getData());
  const handleChannelsChange = createChannelsChangeHandler(
    shippingChannels,
    onChannelsChange,
    triggerChange,
  );
  const isValid = !data.channelListings?.some(channel => validatePrice(channel.price));
  const isSaveDisabled = disabled || !isValid;

  setIsSubmitDisabled(isSaveDisabled);

  return (
    <RichTextContext.Provider value={richText}>
      <form onSubmit={handleFormElementSubmit}>
        <DetailPageLayout>
          <TopNav
            href={backUrl}
            title={
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
                  })
            }
          />
          <DetailPageLayout.Content>
            <ShippingRateInfo data={data} disabled={disabled} errors={errors} onChange={change} />
            <CardSpacer />
            {isPriceVariant ? (
              <OrderValue
                channels={data.channelListings}
                errors={channelErrors}
                orderValueRestricted={data.orderValueRestricted}
                disabled={disabled}
                onChange={change}
                onChannelsChange={handleChannelsChange}
              />
            ) : (
              <OrderWeight
                orderValueRestricted={data.orderValueRestricted}
                disabled={disabled}
                minValue={data.minValue}
                maxValue={data.maxValue}
                onChange={change}
                errors={errors}
              />
            )}
            <CardSpacer />
            <PricingCard
              channels={data.channelListings}
              onChange={handleChannelsChange}
              disabled={disabled}
              errors={channelErrors}
            />
            <CardSpacer />
            <ShippingZonePostalCodes
              disabled={disabled}
              onPostalCodeDelete={onPostalCodeUnassign}
              onPostalCodeInclusionChange={onPostalCodeInclusionChange}
              onPostalCodeRangeAdd={onPostalCodeAssign}
              postalCodes={postalCodes}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <ChannelsAvailabilityCard
              managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
              allChannelsCount={allChannelsCount}
              channelsList={data.channelListings}
              openModal={openChannelsModal}
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
            <Savebar.DeleteButton onClick={onDelete} />
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(backUrl)} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={handleSubmit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      </form>
    </RichTextContext.Provider>
  );
};

export default ShippingZoneRatesCreatePage;
