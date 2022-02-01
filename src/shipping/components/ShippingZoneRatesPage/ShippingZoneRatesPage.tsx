import { OutputData } from "@editorjs/editorjs";
import { ChannelShippingData } from "@saleor/channels/utils";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import { WithFormId } from "@saleor/components/Form/ExitFormDialogProvider";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { ShippingChannelsErrorFragment } from "@saleor/fragments/types/ShippingChannelsErrorFragment";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { ShippingMethodTypeFragment_postalCodeRules } from "@saleor/fragments/types/ShippingMethodTypeFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Backlink } from "@saleor/macaw-ui";
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
  PermissionEnum,
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeEnum
} from "@saleor/types/globalTypes";
import { mapEdgesToItems, mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { FormattedMessage } from "react-intl";

import ShippingZonePostalCodes from "../ShippingZonePostalCodes";
import { ShippingZoneRateUpdateFormData } from "./types";

export interface ShippingZoneRatesPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
    ListActions,
    WithFormId {
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
  onSubmit: (data: ShippingZoneRateUpdateFormData) => SubmitPromise;
  onPostalCodeInclusionChange: (
    inclusion: PostalCodeRuleInclusionTypeEnum
  ) => void;
  onPostalCodeAssign: () => void;
  onPostalCodeUnassign: (
    code: ShippingMethodTypeFragment_postalCodeRules
  ) => void;
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
  formId,
  ...listProps
}) => {
  const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;

  const initialForm: ShippingZoneRateUpdateFormData = {
    channelListings: shippingChannels,
    maxDays: rate?.maximumDeliveryDays?.toString() || "",
    maxValue: rate?.maximumOrderWeight?.value.toString() || "",
    metadata: rate?.metadata.map(mapMetadataItemToInput),
    minDays: rate?.minimumDeliveryDays?.toString() || "",
    minValue: rate?.minimumOrderWeight?.value.toString() || "",
    name: rate?.name || "",
    description: rate?.description && JSON.parse(rate.description),
    orderValueRestricted: !!rate?.channelListings.length,
    privateMetadata: rate?.privateMetadata.map(mapMetadataItemToInput),
    type: rate?.type || null
  };

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      formId={formId}
    >
      {({ change, data, hasChanged, submit, set, triggerChange }) => {
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

        const changeMetadata = makeMetadataChangeHandler(change);
        const formIsUnchanged =
          !hasChanged && !hasChannelChanged && !havePostalCodesChanged;

        return (
          <Container>
            <Backlink onClick={onBack}>
              <FormattedMessage defaultMessage="Shipping" />
            </Backlink>
            <PageHeader title={rate?.name} />
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
                  postalCodes={postalCodeRules}
                />
                <CardSpacer />
                <ShippingMethodProducts
                  products={mapEdgesToItems(rate?.excludedProducts)}
                  onProductAssign={onProductAssign}
                  onProductUnassign={onProductUnassign}
                  disabled={disabled}
                  {...listProps}
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <ChannelsAvailabilityCard
                  managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
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
            <Savebar
              disabled={disabled || formDisabled || formIsUnchanged}
              onCancel={onBack}
              onDelete={onDelete}
              onSubmit={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};

export default ShippingZoneRatesPage;
