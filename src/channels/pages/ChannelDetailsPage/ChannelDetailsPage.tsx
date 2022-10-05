import ChannelAllocationStrategy from "@saleor/channels/components/ChannelAllocationStrategy";
import ShippingZones from "@saleor/channels/components/ShippingZones";
import Warehouses from "@saleor/channels/components/Warehouses";
import { channelsListUrl } from "@saleor/channels/urls";
import CardSpacer from "@saleor/components/CardSpacer";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import RequirePermissions from "@saleor/components/RequirePermissions";
import Savebar from "@saleor/components/Savebar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  AllocationStrategyEnum,
  ChannelDetailsFragment,
  ChannelErrorFragment,
  CountryCode,
  CountryFragment,
  PermissionEnum,
  SearchShippingZonesQuery,
  SearchWarehousesQuery,
  StockSettingsInput,
} from "@saleor/graphql";
import { SearchData } from "@saleor/hooks/makeTopLevelSearch";
import { getParsedSearchData } from "@saleor/hooks/makeTopLevelSearch/utils";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React, { useState } from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import {
  createShippingZoneAddHandler,
  createShippingZoneRemoveHandler,
  createWarehouseAddHandler,
  createWarehouseRemoveHandler,
  createWarehouseReorderHandler,
} from "./handlers";
import { ChannelShippingZones, ChannelWarehouses } from "./types";

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
  countries,
}: ChannelDetailsPageProps<TErrors>) {
  const navigate = useNavigator();

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
  const [
    selectedCountryDisplayName,
    setSelectedCountryDisplayName,
  ] = useStateFromProps(channel?.defaultCountry.country || "");

  const countryChoices = mapCountriesToChoices(countries || []);

  const { defaultCountry, stockSettings, ...formData } =
    channel || ({} as ChannelDetailsFragment);
  const initialStockSettings: StockSettingsInput = {
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
    ...stockSettings,
  };
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
    ...initialStockSettings,
    shippingZonesToDisplay: channelShippingZones,
    warehousesToDisplay: channelWarehouses,
  };

  const getFilteredShippingZonesChoices = (
    shippingZonesToDisplay: ChannelShippingZones,
  ): RelayToFlat<SearchShippingZonesQuery["search"]> =>
    getParsedSearchData({ data: searchShippingZonesData }).filter(
      ({ id: searchedZoneId }) =>
        !shippingZonesToDisplay.some(({ id }) => id === searchedZoneId),
    );

  const getFilteredWarehousesChoices = (
    warehousesToDisplay: ChannelWarehouses,
  ): RelayToFlat<SearchWarehousesQuery["search"]> =>
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

        const addShippingZone = createShippingZoneAddHandler(
          data,
          searchShippingZonesData,
          set,
          triggerChange,
        );
        const removeShippingZone = createShippingZoneRemoveHandler(
          data,
          set,
          triggerChange,
        );

        const addWarehouse = createWarehouseAddHandler(
          data,
          searchWarehousesData,
          set,
          triggerChange,
        );
        const removeWarehouse = createWarehouseRemoveHandler(
          data,
          set,
          triggerChange,
        );
        const reorderWarehouse = createWarehouseReorderHandler(data, set);

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
                <RequirePermissions
                  requiredPermissions={[PermissionEnum.MANAGE_SHIPPING]}
                >
                  <ShippingZones
                    shippingZonesChoices={getFilteredShippingZonesChoices(
                      data.shippingZonesToDisplay,
                    )}
                    shippingZones={data.shippingZonesToDisplay}
                    addShippingZone={addShippingZone}
                    removeShippingZone={removeShippingZone}
                    searchShippingZones={searchShippingZones}
                    fetchMoreShippingZones={fetchMoreShippingZones}
                    totalCount={allShippingZonesCount}
                    loading={disabled}
                  />
                  <CardSpacer />
                </RequirePermissions>
                <RequirePermissions
                  oneOfPermissions={[
                    PermissionEnum.MANAGE_SHIPPING,
                    PermissionEnum.MANAGE_ORDERS,
                    PermissionEnum.MANAGE_PRODUCTS,
                  ]}
                >
                  <Warehouses
                    warehousesChoices={getFilteredWarehousesChoices(
                      data.warehousesToDisplay,
                    )}
                    warehouses={data.warehousesToDisplay}
                    addWarehouse={addWarehouse}
                    removeWarehouse={removeWarehouse}
                    searchWarehouses={searchWarehouses}
                    fetchMoreWarehouses={fetchMoreWarehouses}
                    totalCount={allWarehousesCount}
                    reorderWarehouses={reorderWarehouse}
                    loading={disabled}
                  />
                  <CardSpacer />
                </RequirePermissions>
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
