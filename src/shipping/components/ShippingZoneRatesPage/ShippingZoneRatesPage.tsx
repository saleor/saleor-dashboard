import { ChannelShippingData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { WithFormId } from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import Savebar from "@dashboard/components/Savebar";
import {
  PermissionEnum,
  PostalCodeRuleInclusionTypeEnum,
  ShippingChannelsErrorFragment,
  ShippingErrorFragment,
  ShippingMethodTypeEnum,
  ShippingMethodTypeFragment,
  ShippingZoneQuery,
  TaxClassBaseFragment,
} from "@dashboard/graphql";
import useForm, { SubmitPromise } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useStateUpdate } from "@dashboard/hooks/useStateUpdate";
import { validatePrice } from "@dashboard/products/utils/validation";
import { handleTaxClassChange } from "@dashboard/productTypes/handlers";
import OrderValue from "@dashboard/shipping/components/OrderValue";
import OrderWeight from "@dashboard/shipping/components/OrderWeight";
import PricingCard from "@dashboard/shipping/components/PricingCard";
import ShippingMethodProducts from "@dashboard/shipping/components/ShippingMethodProducts";
import ShippingRateInfo from "@dashboard/shipping/components/ShippingRateInfo";
import { createChannelsChangeHandler } from "@dashboard/shipping/handlers";
import { FetchMoreProps, ListActions, ListProps } from "@dashboard/types";
import { mapEdgesToItems, mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import React, { FormEventHandler } from "react";

import ShippingMethodTaxes from "../ShippingMethodTaxes";
import ShippingZonePostalCodes from "../ShippingZonePostalCodes";
import { ShippingZoneRateUpdateFormData } from "./types";

export interface ShippingZoneRatesPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    ListActions,
    WithFormId {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  disabled: boolean;
  rate: NonNullable<NonNullable<ShippingZoneQuery["shippingZone"]>["shippingMethods"]>[number];
  channelErrors: ShippingChannelsErrorFragment[];
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  postalCodeRules: NonNullable<
    NonNullable<ShippingZoneQuery["shippingZone"]>["shippingMethods"]
  >[number]["postalCodeRules"];
  backHref: string;
  onDelete?: () => void;
  onSubmit: (data: ShippingZoneRateUpdateFormData) => SubmitPromise;
  onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
  onPostalCodeAssign: () => void;
  onPostalCodeUnassign: (
    code: NonNullable<ShippingMethodTypeFragment["postalCodeRules"]>[number],
  ) => void;
  onChannelsChange: (data: ChannelShippingData[]) => void;
  openChannelsModal: () => void;
  onProductAssign: () => void;
  onProductUnassign: (ids: string[]) => void;
  variant: ShippingMethodTypeEnum;
  taxClasses: TaxClassBaseFragment[];
  fetchMoreTaxClasses: FetchMoreProps;
}

export const ShippingZoneRatesPage: React.FC<ShippingZoneRatesPageProps> = ({
  allChannelsCount,
  shippingChannels,
  channelErrors,
  disabled,
  errors,
  backHref,
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
  taxClasses,
  fetchMoreTaxClasses,
  ...listProps
}) => {
  const navigate = useNavigator();
  const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
  const initialForm: Omit<ShippingZoneRateUpdateFormData, "description"> = React.useMemo(
    () => ({
      channelListings: shippingChannels,
      maxDays: rate?.maximumDeliveryDays?.toString() || "",
      maxValue: rate?.maximumOrderWeight?.value.toString() || "",
      metadata: rate?.metadata.map(mapMetadataItemToInput),
      minDays: rate?.minimumDeliveryDays?.toString() || "",
      minValue: rate?.minimumOrderWeight?.value.toString() || "",
      name: rate?.name || "",
      orderValueRestricted: !!rate?.channelListings?.length,
      privateMetadata: rate?.privateMetadata.map(mapMetadataItemToInput),
      type: rate?.type || null,
      taxClassId: rate?.taxClass?.id || "",
    }),
    [shippingChannels, rate],
  );
  const {
    change,
    data: formData,
    setIsSubmitDisabled,
    triggerChange,
  } = useForm(initialForm, undefined, { confirmLeave: true, formId });
  const [taxClassDisplayName, setTaxClassDisplayName] = useStateUpdate(rate?.taxClass?.name ?? "");
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const richText = useRichText({
    initial: rate?.description,
    loading: !rate,
    triggerChange,
  });
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const data: ShippingZoneRateUpdateFormData = {
    ...formData,
    description: null,
  };
  // Prevents closing ref in submit functions
  const getData = async (): Promise<ShippingZoneRateUpdateFormData> => ({
    ...data,
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
  const isValid = !formData.channelListings?.some(channel => validatePrice(channel.price));
  const changeMetadata = makeMetadataChangeHandler(change);
  const isSaveDisabled = disabled || !isValid;
  setIsSubmitDisabled(isSaveDisabled);

  return (
    <RichTextContext.Provider value={richText}>
      <form onSubmit={handleFormElementSubmit}>
        <DetailPageLayout>
          <TopNav href={backHref} title={rate?.name} />
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
              postalCodes={postalCodeRules}
            />
            <CardSpacer />
            <ShippingMethodProducts
              products={mapEdgesToItems(rate?.excludedProducts)!}
              onProductAssign={onProductAssign}
              onProductUnassign={onProductUnassign}
              disabled={disabled}
              {...listProps}
            />
            <CardSpacer />
            <Metadata data={data} onChange={changeMetadata} />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <ChannelsAvailabilityCard
              managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
              allChannelsCount={allChannelsCount!}
              channelsList={data.channelListings.map(channel => ({
                id: channel.id,
                name: channel.name,
              }))}
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
          <Savebar
            disabled={isSaveDisabled}
            onCancel={() => navigate(backHref)}
            onDelete={onDelete}
            onSubmit={handleSubmit}
            state={saveButtonBarState}
          />
        </DetailPageLayout>
      </form>
    </RichTextContext.Provider>
  );
};

export default ShippingZoneRatesPage;
