// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ChannelDeleteDialog } from "@dashboard/channels/components/ChannelDeleteDialog";
import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { ChannelMetadataDialog } from "@dashboard/channels/components/ChannelMetadataDialog/ChannelMetadataDialog";
import { ChannelSetupCard } from "@dashboard/channels/components/ChannelSetupCard/ChannelSetupCard";
import { useChannelSetupCardDismiss } from "@dashboard/channels/components/ChannelSetupCard/useChannelSetupCardDismiss";
import { CreateShippingForChannelDialog } from "@dashboard/channels/components/CreateShippingForChannelDialog/CreateShippingForChannelDialog";
import { CreateWarehouseForChannelDialog } from "@dashboard/channels/components/CreateWarehouseForChannelDialog/CreateWarehouseForChannelDialog";
import { getChannelsCurrencyChoices } from "@dashboard/channels/utils";
import { useChannelWarehousesReorder } from "@dashboard/channels/views/ChannelDetails/useChannelWarehouseReorder";
import { AssignShippingZoneDialog } from "@dashboard/components/AssignShippingZoneDialog/AssignShippingZoneDialog";
import { AssignWarehouseDialog } from "@dashboard/components/AssignWarehouseDialog/AssignWarehouseDialog";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  type ChannelDeleteMutation,
  type ChannelErrorFragment,
  type ChannelUpdateMutation,
  PermissionEnum,
  useChannelActivateMutation,
  useChannelDeactivateMutation,
  useChannelDeleteMutation,
  useChannelQuery,
  useChannelsQuery,
  useChannelUpdateMutation,
} from "@dashboard/graphql";
import {
  getParsedSearchData,
  getSearchFetchMoreProps,
} from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@dashboard/hooks/useNotifier/utils";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors } from "@dashboard/misc";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import {
  channelsListUrl,
  channelUrl,
  type ChannelUrlDialog,
  type ChannelUrlQueryParams,
} from "../../urls";
import { useChannelSetupActions } from "./useChannelSetupActions";
import { useChannelSetupReviewStats } from "./useChannelSetupReviewStats";
import { useShippingZones } from "./useShippingZones";
import { useWarehouses } from "./useWarehouses";

interface ChannelDetailsProps {
  id: string;
  params: ChannelUrlQueryParams;
}

const ChannelDetails = ({ id, params }: ChannelDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const channelsListData = useChannelsQuery({
    displayLoader: true,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelUrlDialog,
    ChannelUrlQueryParams
  >(navigate, params => channelUrl(id, params), params);

  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
    onCompleted: ({ channelUpdate: { errors } }: ChannelUpdateMutation) =>
      notify(getDefaultNotifierSuccessErrorData(errors, intl)),
  });

  const { data, loading } = useChannelQuery({
    displayLoader: true,
    variables: { id },
  });

  const { reorderChannelWarehouses, reorderChannelWarehousesOpts } = useChannelWarehousesReorder();

  const handleError = (error: ChannelErrorFragment) => {
    notify({
      status: "error",
      text: getChannelsErrorMessage(error, intl),
    });
  };

  const [activateChannel, activateChannelOpts] = useChannelActivateMutation({
    onCompleted: data => {
      const errors = data.channelActivate.errors;

      if (errors.length) {
        errors.forEach(error => handleError(error));
      }
    },
  });

  const [deactivateChannel, deactivateChannelOpts] = useChannelDeactivateMutation({
    onCompleted: data => {
      const errors = data.channelDeactivate.errors;

      if (errors.length) {
        errors.forEach(error => handleError(error));
      }
    },
  });

  const handleSubmit = async ({
    allocationStrategy,
    allowUnpaidOrders,
    automaticallyConfirmAllNewOrders,
    automaticallyFulfillNonShippableGiftCard,
    defaultCountry,
    defaultTransactionFlowStrategy,
    releaseFundsForExpiredCheckouts,
    checkoutTtlBeforeReleasingFunds,
    expireOrdersAfter,
    deleteExpiredOrdersAfter,
    markAsPaidStrategy,
    name,
    shippingZonesIdsToAdd,
    shippingZonesIdsToRemove,
    slug,
    warehousesIdsToAdd,
    warehousesIdsToRemove,
    warehousesToDisplay,
    automaticallyCompleteCheckouts,
    allowLegacyGiftCardUse,
    automaticCompletionDelay,
    automaticCompletionCutOffDate,
    automaticCompletionCutOffTime,
  }: FormData) => {
    const getCutOffDateTimeISO = (): string | null => {
      if (!automaticCompletionCutOffDate) {
        return null;
      }

      const time = automaticCompletionCutOffTime || "00:00";

      return new Date(`${automaticCompletionCutOffDate}T${time}`).toISOString();
    };

    // Build automaticCompletion input - only include delay and cutOffDate when enabled
    const automaticCompletionInput: {
      enabled: boolean;
      delay?: number | null;
      cutOffDate?: string | null;
    } = {
      enabled: automaticallyCompleteCheckouts,
    };

    if (automaticallyCompleteCheckouts) {
      // Convert delay to number or null (handle empty string case)
      const delayValue = automaticCompletionDelay;

      if (delayValue === null || delayValue === undefined || delayValue === "") {
        automaticCompletionInput.delay = null;
      } else {
        automaticCompletionInput.delay = Number(delayValue);
      }

      automaticCompletionInput.cutOffDate = getCutOffDateTimeISO();
    }

    const updateChannelMutation = updateChannel({
      variables: {
        id: data?.channel.id,
        input: {
          name,
          checkoutSettings: {
            automaticCompletion: automaticCompletionInput,
            allowLegacyGiftCardUse,
          },
          slug,
          defaultCountry,
          addShippingZones: shippingZonesIdsToAdd,
          removeShippingZones: shippingZonesIdsToRemove,
          addWarehouses: warehousesIdsToAdd,
          removeWarehouses: warehousesIdsToRemove,
          stockSettings: {
            allocationStrategy,
          },
          paymentSettings: {
            defaultTransactionFlowStrategy,
            releaseFundsForExpiredCheckouts,
            checkoutTtlBeforeReleasingFunds: releaseFundsForExpiredCheckouts
              ? checkoutTtlBeforeReleasingFunds || 0
              : checkoutTtlBeforeReleasingFunds,
          },
          orderSettings: {
            markAsPaidStrategy,
            expireOrdersAfter: expireOrdersAfter || 0,
            deleteExpiredOrdersAfter,
            allowUnpaidOrders,
            automaticallyConfirmAllNewOrders,
            automaticallyFulfillNonShippableGiftCard,
          },
        },
      },
    });

    const resultChannel = await updateChannelMutation;
    const errors = await extractMutationErrors(updateChannelMutation);

    if (!errors?.length) {
      await reorderChannelWarehouses({
        channelId: id,
        warehousesToDisplay,
        warehouses: resultChannel.data?.channelUpdate.channel?.warehouses,
      });
    }

    return errors;
  };

  const onDeleteCompleted = (data: ChannelDeleteMutation) => {
    const errors = data.channelDelete.errors;

    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "AkyGP2",
          defaultMessage: "Channel deleted",
        }),
      });
      closeModal();
      navigate(channelsListUrl());
    } else {
      errors.map(error =>
        notify({
          status: "error",
          text: getChannelsErrorMessage(error, intl),
        }),
      );
    }
  };

  const [deleteChannel, deleteChannelOpts] = useChannelDeleteMutation({
    onCompleted: onDeleteCompleted,
  });

  const channelsChoices = getChannelsCurrencyChoices(
    id,
    data?.channel,
    channelsListData?.data?.channels,
  );

  const handleRemoveConfirm = (channelId?: string) => {
    const data = channelId ? { id, input: { channelId } } : { id };

    deleteChannel({ variables: data });
  };

  const userPermissions = useUserPermissions();
  const canCreateWarehouse = hasPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_PRODUCTS,
  ]);
  const {
    canLoadShippingZones,
    shippingZonesCountData,
    shippingZonesCountLoading,
    channelShippingZonesData,
    channelsShippingZonesLoading,
    fetchMoreShippingZones,
    searchShippingZones,
    searchShippingZonesResult,
  } = useShippingZones(id);
  const {
    canLoadWarehouses,
    warehousesCountData,
    warehousesCountLoading,
    fetchMoreWarehouses,
    searchWarehouses,
    searchWarehousesResult,
  } = useWarehouses();

  const channelWarehouses = useMemo(
    () => data?.channel?.warehouses || [],
    [data?.channel?.warehouses],
  );
  const channelShippingZones = mapEdgesToItems(channelShippingZonesData?.shippingZones);
  const setupEmphasized = params.action === "setup";
  const { isDismissed: setupCardDismissed, dismiss: dismissSetupCard } =
    useChannelSetupCardDismiss(id);
  const hasWarehouseAssigned = channelWarehouses.length > 0;
  const hasShippingAssigned = (channelShippingZones?.length ?? 0) > 0;
  const coreSetupIncomplete =
    !hasWarehouseAssigned || (canLoadShippingZones && !hasShippingAssigned);
  // Show for post-create (?action=setup), incomplete core setup, or inactive channels
  // that still need Activate — not for every already-live channel forever.
  const showSetupCard =
    !!data?.channel &&
    !setupCardDismissed &&
    (setupEmphasized || coreSetupIncomplete || !data.channel.isActive);
  const { paymentAppsCount, publishedProductCount, totalProductCount } = useChannelSetupReviewStats(
    {
      channelSlug: data?.channel?.slug,
      skip: !showSetupCard,
    },
  );

  const {
    handleCreateWarehouse,
    handleCreateShipping,
    handleAssignWarehouse,
    handleAssignShippingZone,
    createWarehouseConfirmState,
    createShippingConfirmState,
    assignConfirmState,
  } = useChannelSetupActions({
    channelId: id,
    warehouseIds: channelWarehouses.map(warehouse => warehouse.id),
    onWarehouseCreated: closeModal,
    onShippingCreated: closeModal,
    onAssigned: closeModal,
  });

  const assignedWarehouseIds = useMemo(
    () => new Set(channelWarehouses.map(warehouse => warehouse.id)),
    [channelWarehouses],
  );
  const assignedShippingZoneIds = useMemo(
    () => new Set((channelShippingZones ?? []).map(zone => zone.id)),
    [channelShippingZones],
  );
  const warehousesToAssign = useMemo(
    () =>
      getParsedSearchData({ data: searchWarehousesResult.data }).filter(
        warehouse => !assignedWarehouseIds.has(warehouse.id),
      ),
    [searchWarehousesResult.data, assignedWarehouseIds],
  );
  const shippingZonesToAssign = useMemo(
    () =>
      getParsedSearchData({ data: searchShippingZonesResult.data }).filter(
        zone => !assignedShippingZoneIds.has(zone.id),
      ),
    [searchShippingZonesResult.data, assignedShippingZoneIds],
  );
  const warehouseAssignFetchMore = getSearchFetchMoreProps(
    searchWarehousesResult,
    fetchMoreWarehouses,
  );
  const shippingAssignFetchMore = getSearchFetchMoreProps(
    searchShippingZonesResult,
    fetchMoreShippingZones,
  );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "D9Rg+F",
          defaultMessage: "Channel details",
          description: "window title",
        })}
      />
      <ChannelDetailsPage
        channelShippingZones={channelShippingZones}
        allShippingZonesCount={shippingZonesCountData?.shippingZones?.totalCount}
        searchShippingZones={searchShippingZones}
        searchShippingZonesData={searchShippingZonesResult.data}
        fetchMoreShippingZones={getSearchFetchMoreProps(
          searchShippingZonesResult,
          fetchMoreShippingZones,
        )}
        channelWarehouses={channelWarehouses}
        allWarehousesCount={warehousesCountData?.warehouses?.totalCount}
        searchWarehouses={searchWarehouses}
        searchWarehousesData={searchWarehousesResult.data}
        fetchMoreWarehouses={getSearchFetchMoreProps(searchWarehousesResult, fetchMoreWarehouses)}
        channel={data?.channel}
        disabled={
          updateChannelOpts.loading ||
          reorderChannelWarehousesOpts.loading ||
          loading ||
          shippingZonesCountLoading ||
          warehousesCountLoading ||
          channelsShippingZonesLoading
        }
        disabledStatus={activateChannelOpts.loading || deactivateChannelOpts.loading}
        errors={updateChannelOpts?.data?.channelUpdate?.errors || []}
        onDelete={() => openModal("remove")}
        onShowMetadata={() => openModal("view-metadata")}
        onSubmit={handleSubmit}
        updateChannelStatus={() =>
          data?.channel?.isActive
            ? deactivateChannel({ variables: { id } })
            : activateChannel({ variables: { id } })
        }
        saveButtonBarState={updateChannelOpts.status}
        countries={shop?.countries || []}
        onCreateWarehouse={() => openModal("create-warehouse")}
        onCreateShipping={() => openModal("create-shipping")}
        setupCard={
          showSetupCard && data?.channel ? (
            <ChannelSetupCard
              taxConfigurationId={data.channel.taxConfiguration?.id}
              chargeTaxes={data.channel.taxConfiguration?.chargeTaxes}
              taxCalculationStrategy={data.channel.taxConfiguration?.taxCalculationStrategy}
              channelSlug={data.channel.slug}
              warehouseCount={channelWarehouses.length}
              shippingZoneCount={
                canLoadShippingZones ? (channelShippingZones?.length ?? 0) : undefined
              }
              availableWarehousesCount={warehousesCountData?.warehouses?.totalCount ?? 0}
              availableShippingZonesCount={shippingZonesCountData?.shippingZones?.totalCount ?? 0}
              paymentAppsCount={paymentAppsCount}
              publishedProductCount={publishedProductCount}
              totalProductCount={totalProductCount}
              isActive={data.channel.isActive}
              canCreateWarehouse={canCreateWarehouse}
              canAssignWarehouse={canLoadWarehouses}
              onAssignWarehouse={() => openModal("assign-warehouse")}
              onCreateWarehouse={() => openModal("create-warehouse")}
              onAssignShipping={() => openModal("assign-shipping")}
              onCreateShipping={() => openModal("create-shipping")}
              onActivate={() => activateChannel({ variables: { id } })}
              activateDisabled={activateChannelOpts.loading}
              onDismiss={() => {
                dismissSetupCard();

                if (setupEmphasized) {
                  closeModal();
                }
              }}
            />
          ) : null
        }
      />
      <ChannelDeleteDialog
        channelSlug={data?.channel?.slug}
        currency={data?.channel?.currencyCode}
        channelsChoices={channelsChoices}
        hasOrders={data?.channel?.hasOrders}
        open={params.action === "remove"}
        confirmButtonState={deleteChannelOpts.status}
        onBack={() => navigate(channelsListUrl())}
        onClose={closeModal}
        onConfirm={handleRemoveConfirm}
      />
      <ChannelMetadataDialog
        open={params.action === "view-metadata" && !!data?.channel}
        onClose={closeModal}
        channel={data?.channel}
      />
      {data?.channel && (
        <>
          <CreateWarehouseForChannelDialog
            open={params.action === "create-warehouse"}
            onClose={closeModal}
            channelName={data.channel.name}
            countries={shop?.countries || []}
            defaultCountryCode={data.channel.defaultCountry.code}
            confirmButtonState={createWarehouseConfirmState}
            errors={[]}
            onSubmit={handleCreateWarehouse}
          />
          <CreateShippingForChannelDialog
            open={params.action === "create-shipping"}
            onClose={closeModal}
            channelName={data.channel.name}
            currencyCode={data.channel.currencyCode}
            defaultCountryCode={data.channel.defaultCountry.code}
            defaultCountryName={data.channel.defaultCountry.country}
            warehouseName={channelWarehouses[0]?.name}
            confirmButtonState={createShippingConfirmState}
            errors={[]}
            onSubmit={formData => handleCreateShipping(formData, data.channel.defaultCountry.code)}
          />
          <AssignWarehouseDialog
            open={params.action === "assign-warehouse"}
            onClose={closeModal}
            warehouses={warehousesToAssign}
            loading={searchWarehousesResult.loading}
            hasMore={warehouseAssignFetchMore.hasMore}
            onFetchMore={warehouseAssignFetchMore.onFetchMore}
            onFetch={searchWarehouses}
            confirmButtonState={assignConfirmState}
            onSubmit={selectedWarehouses =>
              handleAssignWarehouse(selectedWarehouses.map(warehouse => warehouse.id))
            }
          />
          <AssignShippingZoneDialog
            open={params.action === "assign-shipping"}
            onClose={closeModal}
            shippingZones={shippingZonesToAssign}
            loading={searchShippingZonesResult.loading}
            hasMore={shippingAssignFetchMore.hasMore}
            onFetchMore={shippingAssignFetchMore.onFetchMore}
            onFetch={searchShippingZones}
            confirmButtonState={assignConfirmState}
            onSubmit={selectedZones => handleAssignShippingZone(selectedZones.map(zone => zone.id))}
          />
        </>
      )}
    </>
  );
};

export default ChannelDetails;
