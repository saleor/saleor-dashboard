import { ChannelShippingData } from "@saleor/channels/utils";
import { Backlink } from "@saleor/components/Backlink";
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
  ShippingMethodTypeFragment,
} from "@saleor/graphql";
import useForm, { SubmitPromise } from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import useNavigator from "@saleor/hooks/useNavigator";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { validatePrice } from "@saleor/products/utils/validation";
import OrderValue from "@saleor/shipping/components/OrderValue";
import OrderWeight from "@saleor/shipping/components/OrderWeight";
import PricingCard from "@saleor/shipping/components/PricingCard";
import ShippingRateInfo from "@saleor/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@saleor/shipping/handlers";
import { RichTextContext } from "@saleor/utils/richText/context";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { FormEventHandler } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
  onPostalCodeInclusionChange: (
    inclusion: PostalCodeRuleInclusionTypeEnum,
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
  };

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
  const isValid = !data.channelListings?.some(channel =>
    validatePrice(channel.price),
  );
  const isSaveDisabled = disabled || !isValid;
  setIsSubmitDisabled(isSaveDisabled);

  return (
    <RichTextContext.Provider value={richText}>
      <form onSubmit={handleFormElementSubmit}>
        <Container>
          <Backlink href={backUrl}>
            <FormattedMessage id="PRlD0A" defaultMessage="Shipping" />
          </Backlink>
          <PageHeader
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
          <Grid>
            <div>
              <ShippingRateInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
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
                channelsList={data.channelListings}
                openModal={openChannelsModal}
              />
            </div>
          </Grid>
          <Savebar
            disabled={isSaveDisabled}
            onCancel={() => navigate(backUrl)}
            onDelete={onDelete}
            onSubmit={handleSubmit}
            state={saveButtonBarState}
          />
        </Container>
      </form>
    </RichTextContext.Provider>
  );
};

export default ShippingZoneRatesCreatePage;
