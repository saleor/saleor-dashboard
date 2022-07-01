import ShippingZonesCard from "@saleor/channels/components/ShippingZonesCard/ShippingZonesCard";
import { channelsListUrl } from "@saleor/channels/urls";
import CardSpacer from "@saleor/components/CardSpacer";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  ChannelDetailsFragment,
  ChannelErrorFragment,
  CountryCode,
  CountryFragment,
  SearchShippingZonesQuery,
} from "@saleor/graphql";
import { SearchData } from "@saleor/hooks/makeTopLevelSearch";
import { getParsedSearchData } from "@saleor/hooks/makeTopLevelSearch/utils";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import {
  getById,
  getByUnmatchingId,
} from "@saleor/orders/components/OrderReturnPage/utils";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React, { useState } from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import { ChannelShippingZones } from "./types";
import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

export interface ChannelDetailsPageProps<TErrors> {
  channel?: ChannelDetailsFragment;
  currencyCodes?: SingleAutocompleteChoiceType[];
  disabled: boolean;
  disabledStatus?: boolean;
  errors: ChannelErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  searchShippingZonesData?: SearchData;
  fetchMoreShippingZones: FetchMoreProps;
  channelShippingZones?: ChannelShippingZones;
  countries: CountryFragment[];
  onDelete?: () => void;
  onSubmit: (data: FormData) => SubmitPromise<TErrors[]>;
  updateChannelStatus?: () => void;
  searchShippingZones: (query: string) => void;
}

const ChannelDetailsPage = function<TErrors>({
  channel,
  currencyCodes,
  disabled,
  disabledStatus,
  onSubmit,
  errors,
  onDelete,
  saveButtonBarState,
  updateChannelStatus,
  searchShippingZones,
  searchShippingZonesData,
  fetchMoreShippingZones,
  countries,
  channelShippingZones = [],
}: ChannelDetailsPageProps<TErrors>) {
  const navigate = useNavigator();

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
  const [
    selectedCountryDisplayName,
    setSelectedCountryDisplayName,
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
    ...formData,
  };

  const getFilteredShippingZonesChoices = (): RelayToFlat<SearchShippingZonesQuery["search"]> =>
    getParsedSearchData({ data: searchShippingZonesData }).filter(
      ({ id: searchedZoneId }) =>
        !shippingZonesToDisplay.some(({ id }) => id === searchedZoneId),
    );

  const checkIfSaveIsDisabled = (data: FormData) => {
    const isValid =
      !!data.name &&
      !!data.slug &&
      !!data.currencyCode &&
      !!data.defaultCountry &&
      data.name.trim().length > 0;

    return disabled || !isValid;
  };

  return (
    <Form
      confirmLeave
      onSubmit={onSubmit}
      initial={initialData}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, submit, set, isSaveDisabled }) => {
        const handleCurrencyCodeSelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedCurrencyCode,
          currencyCodes,
        );
        const handleDefaultCountrySelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedCountryDisplayName,
          countryChoices,
        );

        const addShippingZone = (zoneId: string) => {
          set({
            ...data,
            shippingZonesIdsToRemove: getUpdatedIdsWithoutNewId(
              data.shippingZonesIdsToRemove,
              zoneId,
            ),
            shippingZonesIdsToAdd: getUpdatedIdsWithNewId(
              data.shippingZonesIdsToAdd,
              zoneId,
            ),
          });

          setShippingZonesToDisplay([
            ...shippingZonesToDisplay,
            getParsedSearchData({ data: searchShippingZonesData }).find(
              getById(zoneId),
            ),
          ]);
        };

        const removeShippingZone = (zoneId: string) => {
          set({
            ...data,
            shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(
              data.shippingZonesIdsToAdd,
              zoneId,
            ),
            shippingZonesIdsToRemove: getUpdatedIdsWithNewId(
              data.shippingZonesIdsToRemove,
              zoneId,
            ),
          });

          setShippingZonesToDisplay(
            shippingZonesToDisplay.filter(getByUnmatchingId(zoneId)),
          );
        };

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
              onCancel={() => navigate(channelsListUrl())}
              onSubmit={submit}
              onDelete={onDelete}
              state={saveButtonBarState}
              disabled={isSaveDisabled}
            />
          </>
        );
      }}
    </Form>
  );
};

ChannelDetailsPage.displayName = "ChannelDetailsPage";
export default ChannelDetailsPage;
