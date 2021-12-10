import ShippingZonesCard from "@saleor/channels/components/ShippingZonesCard/ShippingZonesCard";
import CardSpacer from "@saleor/components/CardSpacer";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import { CountryFragment } from "@saleor/fragments/types/CountryFragment";
import { SearchData } from "@saleor/hooks/makeTopLevelSearch";
import { getParsedSearchData } from "@saleor/hooks/makeTopLevelSearch/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import {
  getById,
  getByUnmatchingId
} from "@saleor/orders/components/OrderReturnPage/utils";
import { SearchShippingZones_search_edges_node } from "@saleor/searches/types/SearchShippingZones";
import { FetchMoreProps } from "@saleor/types";
import { CountryCode } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React, { useState } from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import { Channel_channel } from "../../types/Channel";
import { ChannelShippingZones } from "./types";
import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

export interface ChannelDetailsPageProps {
  channel?: Channel_channel;
  currencyCodes?: SingleAutocompleteChoiceType[];
  disabled: boolean;
  disabledStatus?: boolean;
  errors: ChannelErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  searchShippingZonesData?: SearchData;
  fetchMoreShippingZones: FetchMoreProps;
  channelShippingZones?: ChannelShippingZones;
  countries: CountryFragment[];
  onBack?: () => void;
  onDelete?: () => void;
  onSubmit: (data: FormData) => void;
  updateChannelStatus?: () => void;
  searchShippingZones: (query: string) => void;
}

export const ChannelDetailsPage: React.FC<ChannelDetailsPageProps> = ({
  channel,
  currencyCodes,
  disabled,
  disabledStatus,
  onSubmit,
  errors,
  onBack,
  onDelete,
  saveButtonBarState,
  updateChannelStatus,
  searchShippingZones,
  searchShippingZonesData,
  fetchMoreShippingZones,
  countries,
  channelShippingZones = []
}) => {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
  const [
    selectedCountryDisplayName,
    setSelectedCountryDisplayName
  ] = useStateFromProps(channel?.defaultCountry.country || "");

  const [shippingZonesToDisplay, setShippingZonesToDisplay] = useStateFromProps<
    ChannelShippingZones
  >(channelShippingZones);

  const countryChoices = mapCountriesToChoices(countries || []);

  const { defaultCountry, ...formData } = channel || {};
  const initialData: FormData = {
    currencyCode: "",
    name: "",
    slug: "",
    shippingZonesIdsToAdd: [],
    shippingZonesIdsToRemove: [],
    defaultCountry: (defaultCountry?.code || "") as CountryCode,
    ...formData
  };

  const getFilteredShippingZonesChoices = (): SearchShippingZones_search_edges_node[] =>
    getParsedSearchData({ data: searchShippingZonesData }).filter(
      ({ id: searchedZoneId }) =>
        !shippingZonesToDisplay.some(({ id }) => id === searchedZoneId)
    );

  return (
    <Form onSubmit={onSubmit} initial={initialData}>
      {({ change, data, hasChanged, submit, set }) => {
        const handleCurrencyCodeSelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedCurrencyCode,
          currencyCodes
        );
        const handleDefaultCountrySelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedCountryDisplayName,
          countryChoices
        );

        const addShippingZone = (zoneId: string) => {
          set({
            ...data,
            shippingZonesIdsToRemove: getUpdatedIdsWithoutNewId(
              data.shippingZonesIdsToRemove,
              zoneId
            ),
            shippingZonesIdsToAdd: getUpdatedIdsWithNewId(
              data.shippingZonesIdsToAdd,
              zoneId
            )
          });

          setShippingZonesToDisplay([
            ...shippingZonesToDisplay,
            getParsedSearchData({ data: searchShippingZonesData }).find(
              getById(zoneId)
            )
          ]);
        };

        const removeShippingZone = (zoneId: string) => {
          set({
            ...data,
            shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(
              data.shippingZonesIdsToAdd,
              zoneId
            ),
            shippingZonesIdsToRemove: getUpdatedIdsWithNewId(
              data.shippingZonesIdsToRemove,
              zoneId
            )
          });

          setShippingZonesToDisplay(
            shippingZonesToDisplay.filter(getByUnmatchingId(zoneId))
          );
        };

        const formDisabled =
          !data.name ||
          !data.slug ||
          !data.currencyCode ||
          !data.defaultCountry ||
          !(data.name.trim().length > 0);

        return (
          <>
            <Grid>
              <div>
                <ChannelForm
                  data={data}
                  disabled={disabled}
                  currencyCodes={currencyCodes}
                  countries={countryChoices}
                  selectedCurrencyCode={selectedCurrencyCode}
                  selectedCountryDisplayName={selectedCountryDisplayName}
                  onChange={change}
                  onCurrencyCodeChange={handleCurrencyCodeSelect}
                  onDefaultCountryChange={handleDefaultCountrySelect}
                  errors={errors}
                />
              </div>
              <div>
                {!!updateChannelStatus && (
                  <>
                    <ChannelStatus
                      isActive={channel?.isActive}
                      disabled={disabledStatus}
                      updateChannelStatus={updateChannelStatus}
                    />
                    <CardSpacer />
                  </>
                )}
                <ShippingZonesCard
                  shippingZonesChoices={getFilteredShippingZonesChoices()}
                  shippingZones={shippingZonesToDisplay}
                  addShippingZone={addShippingZone}
                  removeShippingZone={removeShippingZone}
                  searchShippingZones={searchShippingZones}
                  fetchMoreShippingZones={fetchMoreShippingZones}
                />
              </div>
            </Grid>
            <Savebar
              onCancel={onBack}
              onSubmit={submit}
              onDelete={onDelete}
              state={saveButtonBarState}
              disabled={disabled || formDisabled || !onSubmit || !hasChanged}
            />
          </>
        );
      }}
    </Form>
  );
};

ChannelDetailsPage.displayName = "ChannelDetailsPage";
export default ChannelDetailsPage;
