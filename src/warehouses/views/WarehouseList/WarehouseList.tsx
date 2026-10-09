import { DeleteFilterTabDialog } from "@dashboard/components/DeleteFilterTabDialog/DeleteFilterTabDialog";
import { SaveFilterTabDialog } from "@dashboard/components/SaveFilterTabDialog/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CountryCode,
  useWarehouseCreateMutation,
  useWarehouseDeleteMutation,
  useWarehouseListQuery,
  WarehouseErrorCode,
  type WarehouseErrorFragment,
} from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { findValueInEnum, getById, getMutationStatus } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import {
  CreateWarehouseDialog,
  type CreateWarehouseFormData,
} from "@dashboard/warehouses/components/CreateWarehouseDialog/CreateWarehouseDialog";
import { WarehouseDeleteDialog } from "@dashboard/warehouses/components/WarehouseDeleteDialog/WarehouseDeleteDialog";
import WarehouseListPage from "@dashboard/warehouses/components/WarehouseListPage/WarehouseListPage";
import { useLegacyStockAvailability } from "@dashboard/warehouses/hooks/useLegacyStockAvailability";
import { useWarehouseListMembership } from "@dashboard/warehouses/hooks/useWarehouseListMembership";
import { useWarehouseStockCount } from "@dashboard/warehouses/hooks/useWarehouseStockCount";
import {
  warehouseListUrl,
  type WarehouseListUrlDialog,
  type WarehouseListUrlQueryParams,
  warehouseUrl,
} from "@dashboard/warehouses/urls";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { getFilterVariables, storageUtils } from "./filters";
import { getSortQueryVariables } from "./sort";

interface WarehouseListProps {
  params: WarehouseListUrlQueryParams;
}

const shopCountryDefaults = (
  shop: ReturnType<typeof useShop>,
): {
  countries: NonNullable<ReturnType<typeof useShop>>["countries"];
  defaultCountryCode: string;
} => ({
  countries: shop?.countries ?? [],
  defaultCountryCode: shop?.defaultCountry?.code ?? "",
});

const submitWarehouseCreate = async ({
  createWarehouse,
  data,
  onCreated,
}: {
  createWarehouse: ReturnType<typeof useWarehouseCreateMutation>[0];
  data: CreateWarehouseFormData;
  onCreated: (warehouseId: string) => void;
}): Promise<WarehouseErrorFragment[]> => {
  const result = await createWarehouse({
    variables: {
      input: {
        name: data.name,
        address: {
          companyName: data.companyName,
          city: data.city,
          cityArea: data.cityArea,
          country: findValueInEnum(data.country, CountryCode),
          countryArea: data.countryArea,
          phone: data.phone,
          postalCode: data.postalCode,
          streetAddress1: data.streetAddress1,
          streetAddress2: data.streetAddress2,
        },
      },
    },
  });
  const errors = result.data?.createWarehouse?.errors ?? [];
  const warehouseId = result.data?.createWarehouse?.warehouse?.id;

  if (!errors.length && warehouseId) {
    onCreated(warehouseId);
  }

  return errors;
};

/** Null until membership is known. */
const membershipChannelCount = (
  membership: ReturnType<typeof useWarehouseListMembership>,
  warehouseId: string,
): number | null =>
  membership.status === "ready"
    ? (membership.channelsByWarehouseId[warehouseId]?.length ?? 0)
    : null;

const WarehouseList = ({ params }: WarehouseListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { countries: shopCountries, defaultCountryCode } = shopCountryDefaults(shop);
  const { updateListSettings, settings } = useListSettings(ListViews.SALES_LIST);
  const intl = useIntl();

  usePaginationReset(warehouseListUrl, params, settings.rowNumber);

  const legacyStockAvailability = useLegacyStockAvailability();
  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );

  const { data, loading, refetch } = useWarehouseListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const limitOpts = useShopLimitsQuery({
    variables: {
      warehouses: true,
    },
  });

  const [deleteWarehouse, deleteWarehouseOpts] = useWarehouseDeleteMutation({
    onCompleted: data => {
      if (data?.deleteWarehouse?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "MzXzjL", defaultMessage: "Warehouse deleted" }),
        });
        refetch();
        limitOpts.refetch();
        closeModal();
      }
    },
  });

  const [, resetFilters, handleSearchChange] = createFilterHandlers({
    createUrl: warehouseListUrl,
    getFilterQueryParam: async () => undefined,
    navigate,
    params,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    WarehouseListUrlDialog,
    WarehouseListUrlQueryParams
  >(navigate, warehouseListUrl, params);

  const paginationValues = usePaginator({
    pageInfo: data?.warehouses?.pageInfo,
    paginationState,
    queryString: params,
  });

  const {
    selectedPreset,
    presets,
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    setPresetIdToDelete,
    getPresetNameToDelete,
  } = useFilterPresets({
    params,
    reset: resetFilters,
    getUrl: warehouseListUrl,
    storageUtils,
  });

  const handleSort = createSortHandler(navigate, warehouseListUrl, params);
  const membership = useWarehouseListMembership();
  const deleteStockCount = useWarehouseStockCount(
    params.action === "delete" ? params.id : undefined,
  ).stockCount;
  const [createWarehouse, createWarehouseOpts] = useWarehouseCreateMutation();
  const deleteTransitionState = getMutationStatus(deleteWarehouseOpts);
  const createTransitionState = getMutationStatus(createWarehouseOpts);
  const handleCreateWarehouse = async (
    data: CreateWarehouseFormData,
  ): Promise<WarehouseErrorFragment[]> => {
    try {
      return await submitWarehouseCreate({
        createWarehouse,
        data,
        onCreated: warehouseId => {
          notify({
            status: "success",
            text: intl.formatMessage({ id: "xeMcID", defaultMessage: "Warehouse created" }),
          });
          navigate(warehouseUrl(warehouseId));
        },
      });
    } catch {
      return [
        {
          __typename: "WarehouseError",
          code: WarehouseErrorCode.INVALID,
          field: null,
          message: intl.formatMessage(commonMessages.somethingWentWrong),
        },
      ];
    }
  };

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <WarehouseListPage
        currentTab={selectedPreset}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onAll={resetFilters}
        onTabChange={onPresetChange}
        onTabDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onTabSave={() => openModal("save-search")}
        limits={limitOpts.data?.shop.limits}
        onTabUpdate={onPresetUpdate}
        tabs={presets.map(tab => tab.name)}
        warehouses={mapEdgesToItems(data?.warehouses)}
        membership={membership.status}
        channelsByWarehouseId={membership.channelsByWarehouseId}
        legacyStockAvailability={legacyStockAvailability}
        settings={settings}
        disabled={loading}
        onAdd={() => openModal("create")}
        onRemove={id => openModal("delete", { id })}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
        hasPresetsChanged={hasPresetsChanged}
      />
      <CreateWarehouseDialog
        open={params.action === "create"}
        confirmButtonState={createTransitionState}
        countries={shopCountries}
        defaultCountryCode={defaultCountryCode}
        disabled={createWarehouseOpts.loading}
        errors={[]}
        onClose={closeModal}
        onSubmit={handleCreateWarehouse}
      />
      {!!params.id && (
        <WarehouseDeleteDialog
          confirmButtonState={deleteTransitionState}
          name={mapEdgesToItems(data?.warehouses)?.find(getById(params.id))?.name ?? ""}
          stockCount={deleteStockCount}
          channelCount={membershipChannelCount(membership, params.id)}
          open={params.action === "delete"}
          onClose={closeModal}
          onConfirm={() =>
            deleteWarehouse({
              variables: {
                id: params.id!,
              },
            })
          }
        />
      )}
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
      />
    </PaginatorContext.Provider>
  );
};

WarehouseList.displayName = "WarehouseList";
export default WarehouseList;
