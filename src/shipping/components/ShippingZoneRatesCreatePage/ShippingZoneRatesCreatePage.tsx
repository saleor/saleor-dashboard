import { ChannelShippingData } from "@saleor/channels/utils";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import Container from "@saleor/components/Container";
import { WithFormId } from "@saleor/components/Form/ExitFormDialogProvider";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  PermissionEnum,
  PostalCodeRuleInclusionTypeEnum,
  ShippingChannelsErrorFragment,
  ShippingErrorFragment,
  ShippingMethodTypeEnum,
  ShippingMethodTypeFragment
} from "@saleor/graphql";
import useForm, { SubmitPromise } from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { validatePrice } from "@saleor/products/utils/validation";
import OrderValue from "@saleor/shipping/components/OrderValue";
import OrderWeight from "@saleor/shipping/components/OrderWeight";
import PricingCard from "@saleor/shipping/components/PricingCard";
import ShippingRateInfo from "@saleor/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@saleor/shipping/handlers";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { FormEventHandler } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZonePostalCodes from "../ShippingZonePostalCodes";
import { ShippingZoneRateCommonFormData } from "../ShippingZoneRatesPage/types";

export interface ShippingZoneRatesCreatePageProps extends WithFormId {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  disabled: boolean;
  hasChannelChanged?: boolean;
  postalCodes?: ShippingMethodTypeFragment["postalCodeRules"];
  channelErrors: ShippingChannelsErrorFragment[];
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onDelete?: () => void;
  onSubmit: (data: ShippingZoneRateCommonFormData) => SubmitPromise;
  onPostalCodeInclusionChange: (
    inclusion: PostalCodeRuleInclusionTypeEnum
  ) => void;
  onPostalCodeAssign: () => void;
  onPostalCodeUnassign: (code: any) => void;
  onChannelsChange: (data: ChannelShippingData[]) => void;
  openChannelsModal: () => void;
  variant: ShippingMethodTypeEnum;
}

export const ShippingZoneRatesCreatePage: React.FC<ShippingZoneRatesCreatePageProps> = ({
  allChannelsCount,
  shippingChannels,
  channelErrors,
  disabled,
  errors,
  hasChannelChanged,
  onBack,
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
  formId
}) => {
  const intl = useIntl();
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
    type: null
  };

  const {
    change,
    data: formData,
    hasChanged,
    setChanged,
    setIsSubmitDisabled,
    triggerChange
  } = useForm(initialForm, undefined, { confirmLeave: true, formId });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
    setChanged
  });

  const [description, changeDescription] = useRichText({
    initial: null,
    triggerChange
  });

  // Prevents closing ref in submit functions
  const getData = () => ({
    ...formData,
    description: description.current
  });
  const data = getData();

  const handleFormElementSubmit: FormEventHandler = event => {
    event.preventDefault();
    handleFormSubmit(getData());
  };
  const handleSubmit = () => handleFormSubmit(getData());

  const handleChannelsChange = createChannelsChangeHandler(
    shippingChannels,
    onChannelsChange,
    triggerChange
  );
  const formDisabled = data.channelListings?.some(channel =>
    validatePrice(channel.price)
  );
  const isSaveDisabled =
    disabled || formDisabled || (!hasChanged && !hasChannelChanged);
  setIsSubmitDisabled(isSaveDisabled);

  return (
    <form onSubmit={handleFormElementSubmit}>
      <Container>
        <Backlink onClick={onBack}>
          <FormattedMessage defaultMessage="Shipping" />
        </Backlink>
        <PageHeader
          title={
            isPriceVariant
              ? intl.formatMessage({
                  defaultMessage: "Price Rate Create",
                  description: "page title"
                })
              : intl.formatMessage({
                  defaultMessage: "Weight Rate Create",
                  description: "page title"
                })
          }
        />
        <Grid>
          <div>
            <ShippingRateInfo
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
              onDescriptionChange={changeDescription}
            />
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
          </div>
          <div>
            <ChannelsAvailabilityCard
              managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
              allChannelsCount={allChannelsCount}
              selectedChannelsCount={shippingChannels?.length}
              channelsList={data.channelListings}
              openModal={openChannelsModal}
            />
          </div>
        </Grid>
        <Savebar
          disabled={isSaveDisabled}
          onCancel={onBack}
          onDelete={onDelete}
          onSubmit={handleSubmit}
          state={saveButtonBarState}
        />
      </Container>
    </form>
  );
};

export default ShippingZoneRatesCreatePage;
