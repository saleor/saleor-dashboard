// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import CountryList from "@dashboard/components/CountryList";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  ShippingErrorFragment,
  ShippingMethodTypeEnum,
  ShippingZoneDetailsFragment,
  ShippingZoneQuery,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { shippingZonesListPath } from "@dashboard/shipping/urls";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Option } from "@saleor/macaw-ui-next";
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

function warehouseToChoice(warehouse: Record<"id" | "name", string>): Option {
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
  const warehouseChoices = warehouses.map(warehouseToChoice);
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

  const shippingZonesListBackLink = useBackLinkWithState({
    path: shippingZonesListPath,
  });

  return (
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav href={shippingZonesListBackLink} title={shippingZone?.name} />
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
                hasMoreWarehouses={hasMore}
                loading={loading}
                onWarehouseChange={change}
                onFetchMoreWarehouses={onFetchMore}
                onWarehousesSearchChange={onSearchChange}
                onWarehouseAdd={onWarehouseAdd}
                warehousesChoices={warehouseChoices}
                allChannels={allChannels}
                onChannelChange={change}
              />
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(shippingZonesListBackLink)} />
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
