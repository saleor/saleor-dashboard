import { ChannelShippingData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailability from "@saleor/components/ChannelsAvailability";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShippingChannelsErrorFragment } from "@saleor/fragments/types/ShippingChannelsErrorFragment";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { ShippingMethodFragment_postalCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import { validatePrice } from "@saleor/products/utils/validation";
import OrderValue from "@saleor/shipping/components/OrderValue";
import OrderWeight from "@saleor/shipping/components/OrderWeight";
import PricingCard from "@saleor/shipping/components/PricingCard";
import ShippingMethodProducts from "@saleor/shipping/components/ShippingMethodProducts";
import ShippingRateInfo from "@saleor/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@saleor/shipping/handlers";
import {
  ShippingZone_shippingZone_shippingMethods,
  ShippingZone_shippingZone_shippingMethods_postalCodeRules
} from "@saleor/shipping/types/ShippingZone";
import { ListActions, ListProps } from "@saleor/types";
import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeEnum
} from "@saleor/types/globalTypes";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { FormattedMessage } from "react-intl";

import ShippingZonePostalCodes from "../ShippingZonePostalCodes";

export interface FormData extends MetadataFormData {
  channelListings: ChannelShippingData[];
  name: string;
  noLimits: boolean;
  minValue: string;
  maxValue: string;
  minDays: string;
  maxDays: string;
  type: ShippingMethodTypeEnum;
}

export interface ShippingZoneRatesPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
    ListActions {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  disabled: boolean;
  hasChannelChanged?: boolean;
  havePostalCodesChanged?: boolean;
  rate: ShippingZone_shippingZone_shippingMethods;
  channelErrors: ShippingChannelsErrorFragment[];
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  postalCodeRules: ShippingZone_shippingZone_shippingMethods_postalCodeRules[];
  onBack: () => void;
  onDelete?: () => void;
  onSubmit: (data: FormData) => void;
  onPostalCodeInclusionChange: (
    inclusion: PostalCodeRuleInclusionTypeEnum
  ) => void;
  onPostalCodeAssign: () => void;
  onPostalCodeUnassign: (code: ShippingMethodFragment_postalCodeRules) => void;
  onChannelsChange: (data: ChannelShippingData[]) => void;
  openChannelsModal: () => void;
  onProductAssign: () => void;
  onProductUnassign: (ids: string[]) => void;
  variant: ShippingMethodTypeEnum;
}

export const ShippingZoneRatesPage: React.FC<ShippingZoneRatesPageProps> = ({
  allChannelsCount,
  shippingChannels,
  channelErrors,
  disabled,
  errors,
  hasChannelChanged,
  havePostalCodesChanged,
  onBack,
  onDelete,
  onSubmit,
  onPostalCodeInclusionChange,
  onChannelsChange,
  onPostalCodeAssign,
  onPostalCodeUnassign,
  onProductAssign,
  onProductUnassign,
  openChannelsModal,
  rate,
  saveButtonBarState,
  postalCodeRules,
  variant,
  ...listProps
}) => {
  const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
  const initialForm: FormData = {
    channelListings: shippingChannels,
    maxDays: rate?.maximumDeliveryDays?.toString() || "",
    maxValue: rate?.maximumOrderWeight?.value.toString() || "",
    metadata: rate?.metadata.map(mapMetadataItemToInput),
    minDays: rate?.minimumDeliveryDays?.toString() || "",
    minValue: rate?.minimumOrderWeight?.value.toString() || "",
    name: rate?.name || "",
    noLimits: false,
    privateMetadata: rate?.privateMetadata.map(mapMetadataItemToInput),
    type: rate?.type || null
  };

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const handleChannelsChange = createChannelsChangeHandler(
          shippingChannels,
          onChannelsChange,
          triggerChange
        );
        const formDisabled = data.channelListings?.some(channel =>
          validatePrice(channel.price)
        );

        const changeMetadata = makeMetadataChangeHandler(change);
        const formIsUnchanged =
          !hasChanged && !hasChannelChanged && !havePostalCodesChanged;

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage defaultMessage="Shipping" />
            </AppHeader>
            <PageHeader title={rate?.name} />
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
                  postalCodes={postalCodeRules}
                />
                <CardSpacer />
                <ShippingMethodProducts
                  products={rate?.excludedProducts?.edges.map(
                    edge => edge.node
                  )}
                  onProductAssign={onProductAssign}
                  onProductUnassign={onProductUnassign}
                  disabled={disabled}
                  {...listProps}
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <ChannelsAvailability
                  allChannelsCount={allChannelsCount}
                  selectedChannelsCount={shippingChannels?.length}
                  channelsList={data.channelListings.map(channel => ({
                    id: channel.id,
                    name: channel.name
                  }))}
                  openModal={openChannelsModal}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || formDisabled || formIsUnchanged}
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

export default ShippingZoneRatesPage;
