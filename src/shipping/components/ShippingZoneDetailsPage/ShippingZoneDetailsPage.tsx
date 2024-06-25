// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import CountryList from "@dashboard/components/CountryList";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { Savebar } from "@dashboard/components/Savebar";
import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import {
  ChannelFragment,
  ShippingErrorFragment,
  ShippingMethodTypeEnum,
  ShippingZoneDetailsFragment,
  ShippingZoneQuery,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { shippingZonesListUrl } from "@dashboard/shipping/urls";
import createMultiAutocompleteSelectHandler from "@dashboard/utils/handlers/multiAutocompleteSelectChangeHandler";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { getStringOrPlaceholder } from "../../../misc";
import { ChannelProps, FetchMoreProps, SearchProps } from "../../../types";
import { ShippingZoneUpdateFormData } from "../../components/ShippingZoneDetailsPage/types";
import ShippingZoneInfo from "../ShippingZoneInfo";
import ShippingZoneRates from "../ShippingZoneRates";
import ShippingZoneSettingsCard from "../ShippingZoneSettingsCard";
import { getInitialFormData } from "./utils";

const messages = defineMessages({
  countries: {
    id: "55LMJv",
    defaultMessage: "Countries",
    description: "country list header",
  },
  noCountriesAssigned: {
    id: "y7mfbl",
    defaultMessage: "Currently, there are no countries assigned to this shipping zone",
  },
  shipping: {
    id: "G0+gAp",
    defaultMessage: "Shipping",
    description: "shipping section header",
  },
});

export interface ShippingZoneDetailsPageProps extends FetchMoreProps, SearchProps, ChannelProps {
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  shippingZone: ShippingZoneQuery["shippingZone"];
  warehouses: ShippingZoneDetailsFragment["warehouses"];
  onCountryAdd: () => void;
  onCountryRemove: (code: string) => void;
  onDelete: () => void;
  onPriceRateAdd: () => void;
  getPriceRateEditHref: (id: string) => string;
  onRateRemove: (rateId: string) => void;
  onSubmit: (data: ShippingZoneUpdateFormData) => SubmitPromise;
  onWarehouseAdd: () => void;
  onWeightRateAdd: () => void;
  getWeightRateEditHref: (id: string) => string;
  allChannels?: ChannelFragment[];
}

function warehouseToChoice(warehouse: Record<"id" | "name", string>): SingleAutocompleteChoiceType {
  return {
    label: warehouse.name,
    value: warehouse.id,
  };
}

const ShippingZoneDetailsPage: React.FC<ShippingZoneDetailsPageProps> = ({
  disabled,
  errors,
  hasMore,
  loading,
  onCountryAdd,
  onCountryRemove,
  onDelete,
  onFetchMore,
  onPriceRateAdd,
  getPriceRateEditHref,
  onRateRemove,
  onSearchChange,
  onSubmit,
  onWarehouseAdd,
  onWeightRateAdd,
  getWeightRateEditHref,
  saveButtonBarState,
  selectedChannelId,
  shippingZone,
  warehouses,
  allChannels,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const initialForm = getInitialFormData(shippingZone);
  const [warehouseDisplayValues, setWarehouseDisplayValues] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >(mapNodeToChoice(shippingZone?.warehouses));
  const warehouseChoices = warehouses.map(warehouseToChoice);
  const channelChoices = mapNodeToChoice(allChannels);
  const [channelsDisplayValues, setChannelDisplayValues] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >(mapNodeToChoice(shippingZone?.channels));
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

  return (
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave disabled={disabled}>
      {({ change, data, isSaveDisabled, submit, toggleValue }) => {
        const handleWarehouseChange = createMultiAutocompleteSelectHandler(
          toggleValue,
          setWarehouseDisplayValues,
          warehouseDisplayValues,
          warehouseChoices,
        );
        const handleChannelChange = createMultiAutocompleteSelectHandler(
          toggleValue,
          setChannelDisplayValues,
          channelsDisplayValues,
          channelChoices,
        );
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav href={shippingZonesListUrl()} title={shippingZone?.name} />
            <DetailPageLayout.Content>
              <ShippingZoneInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              <CardSpacer />
              <CountryList
                countries={shippingZone?.countries}
                disabled={disabled}
                emptyText={getStringOrPlaceholder(
                  shippingZone && intl.formatMessage(messages.noCountriesAssigned),
                )}
                onCountryAssign={onCountryAdd}
                onCountryUnassign={onCountryRemove}
                title={intl.formatMessage(messages.countries)}
              />
              <CardSpacer />
              <ShippingZoneRates
                disabled={disabled}
                onRateAdd={onPriceRateAdd}
                getRateEditHref={getPriceRateEditHref}
                onRateRemove={onRateRemove}
                rates={shippingZone?.shippingMethods?.filter(
                  method => method.type === ShippingMethodTypeEnum.PRICE,
                )}
                variant="price"
                selectedChannelId={selectedChannelId}
                testId="add-price-rate"
              />
              <CardSpacer />
              <ShippingZoneRates
                disabled={disabled}
                onRateAdd={onWeightRateAdd}
                getRateEditHref={getWeightRateEditHref}
                onRateRemove={onRateRemove}
                rates={shippingZone?.shippingMethods?.filter(
                  method => method.type === ShippingMethodTypeEnum.WEIGHT,
                )}
                variant="weight"
                selectedChannelId={selectedChannelId}
                testId="add-weight-rate"
              />
              <CardSpacer />
              <Metadata data={data} onChange={changeMetadata} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <ShippingZoneSettingsCard
                formData={data}
                warehousesDisplayValues={warehouseDisplayValues}
                hasMoreWarehouses={hasMore}
                loading={loading}
                onWarehouseChange={handleWarehouseChange}
                onFetchMoreWarehouses={onFetchMore}
                onWarehousesSearchChange={onSearchChange}
                onWarehouseAdd={onWarehouseAdd}
                warehousesChoices={warehouseChoices}
                allChannels={allChannels}
                channelsDisplayValues={channelsDisplayValues}
                onChannelChange={handleChannelChange}
              />
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(shippingZonesListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
export default ShippingZoneDetailsPage;
