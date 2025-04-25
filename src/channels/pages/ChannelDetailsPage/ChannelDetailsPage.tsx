// @ts-strict-ignore
import ChannelAllocationStrategy from "@dashboard/channels/components/ChannelAllocationStrategy";
import ShippingZones from "@dashboard/channels/components/ShippingZones";
import Warehouses from "@dashboard/channels/components/Warehouses";
import { channelsListUrl } from "@dashboard/channels/urls";
import { validateChannelFormData } from "@dashboard/channels/validation";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
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
} from "@dashboard/graphql";
import {
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql/types.generated";
import { SearchData } from "@dashboard/hooks/makeTopLevelSearch";
import { getParsedSearchData } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Option } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

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

export interface ChannelDetailsPageProps<TErrors extends ChannelErrorFragment[]> {
  channel?: ChannelDetailsFragment;
  currencyCodes?: Option[];
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
  onSubmit: (data: FormData) => SubmitPromise<TErrors>;
  updateChannelStatus?: () => void;
  searchShippingZones: (query: string) => void;
  searchWarehouses: (query: string) => void;
}

const ChannelDetailsPage = function <TErrors extends ChannelErrorFragment[]>({
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
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<ChannelErrorFragment[]>([]);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
  const [selectedCountryDisplayName, setSelectedCountryDisplayName] = useStateFromProps(
    channel?.defaultCountry.country || "",
  );
  const countryChoices = mapCountriesToChoices(countries || []);
  const {
    defaultCountry,
    stockSettings,
    orderSettings,
    paymentSettings,
    checkoutSettings,
    ...formData
  } = channel || ({} as ChannelDetailsFragment);
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
    markAsPaidStrategy: orderSettings?.markAsPaidStrategy,
    deleteExpiredOrdersAfter: orderSettings?.deleteExpiredOrdersAfter,
    allowUnpaidOrders: orderSettings?.allowUnpaidOrders,
    defaultTransactionFlowStrategy: paymentSettings?.defaultTransactionFlowStrategy,
    automaticallyCompleteCheckouts: checkoutSettings?.automaticallyCompleteFullyPaidCheckouts,
  };
  const getFilteredShippingZonesChoices = (
    shippingZonesToDisplay: ChannelShippingZones,
  ): RelayToFlat<SearchShippingZonesQuery["search"]> =>
    getParsedSearchData({ data: searchShippingZonesData }).filter(
      ({ id: searchedZoneId }) => !shippingZonesToDisplay.some(({ id }) => id === searchedZoneId),
    );
  const getFilteredWarehousesChoices = (
    warehousesToDisplay: ChannelWarehouses,
  ): RelayToFlat<SearchWarehousesQuery["search"]> =>
    getParsedSearchData({ data: searchWarehousesData }).filter(
      ({ id: searchedWarehouseId }) =>
        !warehousesToDisplay.some(({ id }) => id === searchedWarehouseId),
    );
  const handleSubmit = async (data: FormData) => {
    const errors = validateChannelFormData(data);

    setValidationErrors(errors);

    if (errors.length) {
      return errors;
    }

    return onSubmit(data);
  };

  return (
    <Form confirmLeave onSubmit={handleSubmit} initial={initialData}>
      {({ change, data, submit, set, triggerChange }) => {
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
        const removeShippingZone = createShippingZoneRemoveHandler(data, set, triggerChange);
        const addWarehouse = createWarehouseAddHandler(
          data,
          searchWarehousesData,
          set,
          triggerChange,
        );
        const removeWarehouse = createWarehouseRemoveHandler(data, set, triggerChange);
        const reorderWarehouse = createWarehouseReorderHandler(data, set);
        const handleMarkAsPaidStrategyChange = () => {
          if (!data.markAsPaidStrategy) {
            set({
              markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
            });

            return;
          }

          set({
            markAsPaidStrategy:
              data.markAsPaidStrategy === MarkAsPaidStrategyEnum.PAYMENT_FLOW
                ? MarkAsPaidStrategyEnum.TRANSACTION_FLOW
                : MarkAsPaidStrategyEnum.PAYMENT_FLOW,
          });
        };
        const handleTransactionFlowStrategyChange = () => {
          if (!data.defaultTransactionFlowStrategy) {
            set({
              defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.AUTHORIZATION,
            });

            return;
          }

          set({
            defaultTransactionFlowStrategy:
              data.defaultTransactionFlowStrategy === TransactionFlowStrategyEnum.CHARGE
                ? TransactionFlowStrategyEnum.AUTHORIZATION
                : TransactionFlowStrategyEnum.CHARGE,
          });
        };

        const handleAutomaticallyCompleteCheckoutsChange = () => {
          set({
            automaticallyCompleteCheckouts: !data.automaticallyCompleteCheckouts,
          });
        };

        const allErrors = [...errors, ...validationErrors];

        return (
          <DetailPageLayout>
            <TopNav
              href={channelsListUrl()}
              title={
                channel?.name ||
                intl.formatMessage({
                  id: "DnghuS",
                  defaultMessage: "New Channel",
                  description: "channel create",
                })
              }
            />
            <DetailPageLayout.Content>
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
                onMarkAsPaidStrategyChange={handleMarkAsPaidStrategyChange}
                onTransactionFlowStrategyChange={handleTransactionFlowStrategyChange}
                onAutomaticallyCompleteCheckoutsChange={handleAutomaticallyCompleteCheckoutsChange}
                errors={allErrors}
              />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
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
              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_SHIPPING]}>
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
                  warehousesChoices={getFilteredWarehousesChoices(data.warehousesToDisplay)}
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
              <ChannelAllocationStrategy data={data} disabled={disabled} onChange={change} />
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(channelsListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={disabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

ChannelDetailsPage.displayName = "ChannelDetailsPage";
export default ChannelDetailsPage;
