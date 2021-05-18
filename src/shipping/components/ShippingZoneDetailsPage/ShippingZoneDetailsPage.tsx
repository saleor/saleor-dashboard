import { BaseChannels_channels } from "@saleor/channels/types/BaseChannels";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { ShippingZoneDetailsFragment_warehouses } from "@saleor/fragments/types/ShippingZoneDetailsFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { ShippingZone_shippingZone } from "@saleor/shipping/types/ShippingZone";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import { mapNodeToChoice } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { getStringOrPlaceholder } from "../../../misc";
import { ChannelProps, FetchMoreProps, SearchProps } from "../../../types";
import { ShippingMethodTypeEnum } from "../../../types/globalTypes";
import { FormData } from "../../components/ShippingZoneDetailsPage/types";
import ShippingZoneInfo from "../ShippingZoneInfo";
import ShippingZoneRates from "../ShippingZoneRates";
import ShippingZoneSettingsCard from "../ShippingZoneSettingsCard";
import { getInitialFormData } from "./utils";

const messages = defineMessages({
  countries: {
    defaultMessage: "Countries",
    description: "country list header"
  },
  defaultZone: {
    defaultMessage:
      "This is default shipping zone, which means that it covers all of the countries which are not assigned to other shipping zones"
  },
  noCountriesAssigned: {
    defaultMessage:
      "Currently, there are no countries assigned to this shipping zone"
  },
  shipping: {
    defaultMessage: "Shipping",
    description: "shipping section header"
  }
});

export interface ShippingZoneDetailsPageProps
  extends FetchMoreProps,
    SearchProps,
    ChannelProps {
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  shippingZone: ShippingZone_shippingZone;
  warehouses: ShippingZoneDetailsFragment_warehouses[];
  onBack: () => void;
  onCountryAdd: () => void;
  onCountryRemove: (code: string) => void;
  onDelete: () => void;
  onPriceRateAdd: () => void;
  onPriceRateEdit: (id: string) => void;
  onRateRemove: (rateId: string) => void;
  onSubmit: (data: FormData) => SubmitPromise;
  onWarehouseAdd: () => void;
  onWeightRateAdd: () => void;
  onWeightRateEdit: (id: string) => void;
  allChannels?: BaseChannels_channels[];
}

function warehouseToChoice(
  warehouse: Record<"id" | "name", string>
): SingleAutocompleteChoiceType {
  return {
    label: warehouse.name,
    value: warehouse.id
  };
}

const ShippingZoneDetailsPage: React.FC<ShippingZoneDetailsPageProps> = ({
  disabled,
  errors,
  hasMore,
  loading,
  onBack,
  onCountryAdd,
  onCountryRemove,
  onDelete,
  onFetchMore,
  onPriceRateAdd,
  onPriceRateEdit,
  onRateRemove,
  onSearchChange,
  onSubmit,
  onWarehouseAdd,
  onWeightRateAdd,
  onWeightRateEdit,
  saveButtonBarState,
  selectedChannelId,
  shippingZone,
  warehouses,
  allChannels
}) => {
  const intl = useIntl();

  const initialForm = getInitialFormData(shippingZone);

  const [warehouseDisplayValues, setWarehouseDisplayValues] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >(mapNodeToChoice(shippingZone?.warehouses));

  const warehouseChoices = warehouses.map(warehouseToChoice);

  const channelChoices = mapNodeToChoice(allChannels);

  const [channelsDisplayValues, setChannelDisplayValues] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >(mapNodeToChoice(shippingZone?.channels));

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit, toggleValue }) => {
        const handleWarehouseChange = createMultiAutocompleteSelectHandler(
          toggleValue,
          setWarehouseDisplayValues,
          warehouseDisplayValues,
          warehouseChoices
        );

        const handleChannelChange = createMultiAutocompleteSelectHandler(
          toggleValue,
          setChannelDisplayValues,
          channelsDisplayValues,
          channelChoices
        );

        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage {...messages.shipping} />
            </AppHeader>
            <PageHeader title={shippingZone?.name} />
            <Grid>
              <div>
                <ShippingZoneInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CountryList
                  countries={shippingZone?.countries}
                  disabled={disabled}
                  emptyText={getStringOrPlaceholder(
                    shippingZone?.default === undefined
                      ? undefined
                      : shippingZone.default
                      ? intl.formatMessage(messages.defaultZone)
                      : intl.formatMessage(messages.noCountriesAssigned)
                  )}
                  onCountryAssign={onCountryAdd}
                  onCountryUnassign={onCountryRemove}
                  title={intl.formatMessage(messages.countries)}
                />
                <CardSpacer />
                <ShippingZoneRates
                  disabled={disabled}
                  onRateAdd={onPriceRateAdd}
                  onRateEdit={onPriceRateEdit}
                  onRateRemove={onRateRemove}
                  rates={shippingZone?.shippingMethods?.filter(
                    method => method.type === ShippingMethodTypeEnum.PRICE
                  )}
                  variant="price"
                  selectedChannelId={selectedChannelId}
                  testId="add-price-rate"
                />
                <CardSpacer />
                <ShippingZoneRates
                  disabled={disabled}
                  onRateAdd={onWeightRateAdd}
                  onRateEdit={onWeightRateEdit}
                  onRateRemove={onRateRemove}
                  rates={shippingZone?.shippingMethods?.filter(
                    method => method.type === ShippingMethodTypeEnum.WEIGHT
                  )}
                  variant="weight"
                  selectedChannelId={selectedChannelId}
                  testId="add-weight-rate"
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
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
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
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
ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
export default ShippingZoneDetailsPage;
