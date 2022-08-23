import ChannelAllocationStrategy from "@saleor/channels/components/ChannelAllocationStrategy";
import ShippingZones from "@saleor/channels/components/ShippingZones";
import Warehouses from "@saleor/channels/components/Warehouses";
import { channelsListUrl } from "@saleor/channels/urls";
import CardSpacer from "@saleor/components/CardSpacer";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  AllocationStrategyEnum,
  ChannelDetailsFragment,
  ChannelErrorFragment,
  CountryCode,
  CountryFragment,
  SearchShippingZonesQuery,
  SearchWarehousesQuery,
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
import { FetchMoreProps, RelayToFlat, ReorderAction } from "@saleor/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React, { useState } from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import { ChannelShippingZones, ChannelWarehouses } from "./types";
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
  allShippingZonesCount: number;
  searchWarehousesData?: SearchData;
  fetchMoreWarehouses: FetchMoreProps;
  channelWarehouses?: ChannelWarehouses;
  allWarehousesCount: number;
  countries: CountryFragment[];
  onDelete?: () => void;
  onSubmit: (data: FormData) => SubmitPromise<TErrors[]>;
  updateChannelStatus?: () => void;
  searchShippingZones: (query: string) => void;
  searchWarehouses: (query: string) => void;
  reorderWarehouses?: ReorderAction;
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
  channelShippingZones = [],
  allShippingZonesCount,
  searchWarehouses,
  searchWarehousesData,
  fetchMoreWarehouses,
  channelWarehouses = [],
  allWarehousesCount,
  reorderWarehouses,
  countries,
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
  const [warehousesToDisplay, setWarehousesToDisplay] = useStateFromProps<
    ChannelWarehouses
  >(channelWarehouses);

  const countryChoices = mapCountriesToChoices(countries || []);

  const { defaultCountry, stockSettings, ...formData } =
    channel || ({} as ChannelDetailsFragment);
  const initialData: FormData = {
    currencyCode: "",
    name: "",
    slug: "",
    shippingZonesIdsToAdd: [],
    shippingZonesIdsToRemove: [],
    warehousesIdsToAdd: [],
    warehousesIdsToRemove: [],
    defaultCountry: (defaultCountry?.code || "") as CountryCode,
    ...formData,
    stockSettings: {
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
      ...stockSettings,
    },
  };

  const getFilteredShippingZonesChoices = (): RelayToFlat<SearchShippingZonesQuery["search"]> =>
    getParsedSearchData({ data: searchShippingZonesData }).filter(
      ({ id: searchedZoneId }) =>
        !shippingZonesToDisplay.some(({ id }) => id === searchedZoneId),
    );

  const getFilteredWarehousesChoices = (): RelayToFlat<SearchWarehousesQuery["search"]> =>
    getParsedSearchData({ data: searchWarehousesData }).filter(
      ({ id: searchedWarehouseId }) =>
        !warehousesToDisplay.some(({ id }) => id === searchedWarehouseId),
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
      {({ change, data, submit, set, isSaveDisabled, triggerChange }) => {
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
          triggerChange();

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
          triggerChange();

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

        const addWarehouse = (warehouseId: string) => {
          triggerChange();

          set({
            ...data,
            warehousesIdsToRemove: getUpdatedIdsWithoutNewId(
              data.warehousesIdsToRemove,
              warehouseId,
            ),
            warehousesIdsToAdd: getUpdatedIdsWithNewId(
              data.warehousesIdsToAdd,
              warehouseId,
            ),
          });

          setWarehousesToDisplay([
            ...warehousesToDisplay,
            getParsedSearchData({ data: searchWarehousesData }).find(
              getById(warehouseId),
            ),
          ]);
        };

        const removeWarehouse = (warehouseId: string) => {
          triggerChange();

          set({
            ...data,
            warehousesIdsToAdd: getUpdatedIdsWithoutNewId(
              data.warehousesIdsToAdd,
              warehouseId,
            ),
            warehousesIdsToRemove: getUpdatedIdsWithNewId(
              data.warehousesIdsToRemove,
              warehouseId,
            ),
          });

          setWarehousesToDisplay(
            warehousesToDisplay.filter(getByUnmatchingId(warehouseId)),
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
                <ShippingZones
                  shippingZonesChoices={getFilteredShippingZonesChoices()}
                  shippingZones={shippingZonesToDisplay}
                  addShippingZone={addShippingZone}
                  removeShippingZone={removeShippingZone}
                  searchShippingZones={searchShippingZones}
                  fetchMoreShippingZones={fetchMoreShippingZones}
                  totalCount={allShippingZonesCount}
                />
                <CardSpacer />
                <Warehouses
                  warehousesChoices={getFilteredWarehousesChoices()}
                  warehouses={warehousesToDisplay}
                  addWarehouse={addWarehouse}
                  removeWarehouse={removeWarehouse}
                  searchWarehouses={searchWarehouses}
                  fetchMoreWarehouses={fetchMoreWarehouses}
                  totalCount={allWarehousesCount}
                  reorderWarehouses={reorderWarehouses}
                />
                <CardSpacer />
                <ChannelAllocationStrategy
                  data={data}
                  disabled={disabled}
                  onChange={change}
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
