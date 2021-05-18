import { OutputData } from "@editorjs/editorjs";
import { ChannelShippingData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShippingChannelsErrorFragment } from "@saleor/fragments/types/ShippingChannelsErrorFragment";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { ShippingMethodFragment_postalCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import { validatePrice } from "@saleor/products/utils/validation";
import OrderValue from "@saleor/shipping/components/OrderValue";
import OrderWeight from "@saleor/shipping/components/OrderWeight";
import PricingCard from "@saleor/shipping/components/PricingCard";
import ShippingRateInfo from "@saleor/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@saleor/shipping/handlers";
import {
  PermissionEnum,
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeEnum
} from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZonePostalCodes from "../ShippingZonePostalCodes";

export interface FormData {
  channelListings: ChannelShippingData[];
  name: string;
  description: OutputData;
  noLimits: boolean;
  minValue: string;
  maxValue: string;
  minDays: string;
  maxDays: string;
  type: ShippingMethodTypeEnum;
}

export interface ShippingZoneRatesCreatePageProps {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  disabled: boolean;
  hasChannelChanged?: boolean;
  postalCodes?: ShippingMethodFragment_postalCodeRules[];
  channelErrors: ShippingChannelsErrorFragment[];
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onDelete?: () => void;
  onSubmit: (data: FormData) => void;
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
  postalCodes
}) => {
  const intl = useIntl();
  const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
  const initialForm: FormData = {
    channelListings: shippingChannels,
    maxDays: "",
    maxValue: "",
    minDays: "",
    minValue: "",
    name: "",
    description: null,
    noLimits: false,
    type: null
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit, triggerChange, set }) => {
        const handleChannelsChange = createChannelsChangeHandler(
          shippingChannels,
          onChannelsChange,
          triggerChange
        );
        const formDisabled = data.channelListings?.some(channel =>
          validatePrice(channel.price)
        );
        const onDescriptionChange = (description: OutputData) => {
          set({ description });
          triggerChange();
        };

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage defaultMessage="Shipping" />
            </AppHeader>
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
                  onDescriptionChange={onDescriptionChange}
                />
                <CardSpacer />
                {isPriceVariant ? (
                  <OrderValue
                    channels={data.channelListings}
                    errors={channelErrors}
                    noLimits={data.noLimits}
                    disabled={disabled}
                    onChange={change}
                    onChannelsChange={handleChannelsChange}
                  />
                ) : (
                  <OrderWeight
                    noLimits={data.noLimits}
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
            <SaveButtonBar
              disabled={
                disabled || formDisabled || (!hasChanged && !hasChannelChanged)
              }
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};

export default ShippingZoneRatesCreatePage;
