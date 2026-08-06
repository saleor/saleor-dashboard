// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { useUser } from "@dashboard/auth/useUser";
import { BulkPublishToChannelDialog } from "@dashboard/channels/components/BulkPublishToChannelDialog/BulkPublishToChannelDialog";
import { ChannelDeleteDialog } from "@dashboard/channels/components/ChannelDeleteDialog";
import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { ChannelMetadataDialog } from "@dashboard/channels/components/ChannelMetadataDialog/ChannelMetadataDialog";
import {
  type ChannelSectionId,
  channelSectionIds,
} from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import { ChannelSetupCard } from "@dashboard/channels/components/ChannelSetupCard/ChannelSetupCard";
import { useChannelSetupCardDismiss } from "@dashboard/channels/components/ChannelSetupCard/useChannelSetupCardDismiss";
import { ChannelActivateDialog } from "@dashboard/channels/components/ChannelStatus/ChannelActivateDialog";
import { ChannelDeactivateDialog } from "@dashboard/channels/components/ChannelStatus/ChannelDeactivateDialog";
import { CreateChannelDialog } from "@dashboard/channels/components/CreateChannelDialog/CreateChannelDialog";
import { messages as createChannelMessages } from "@dashboard/channels/components/CreateChannelDialog/messages";
import { type ChannelCreateFormData } from "@dashboard/channels/components/CreateChannelDialog/types";
import { CreateShippingForChannelDialog } from "@dashboard/channels/components/CreateShippingForChannelDialog/CreateShippingForChannelDialog";
import { CreateWarehouseForChannelDialog } from "@dashboard/channels/components/CreateWarehouseForChannelDialog/CreateWarehouseForChannelDialog";
import { useChannelPaymentApps } from "@dashboard/channels/hooks/useChannelPaymentApps";
import {
  assignmentIdsEqual,
  type ChannelAssignmentActions,
  type ChannelDisplayedAssignmentIds,
} from "@dashboard/channels/pages/ChannelDetailsPage/ChannelAssignmentActions";
import { getChannelsCurrencyChoices } from "@dashboard/channels/utils";
import { buildChannelCreateInput } from "@dashboard/channels/utils/buildChannelCreateInput";
import {
  buildChannelDuplicateSource,
  getChannelDuplicateFormPrefill,
} from "@dashboard/channels/utils/channelDuplicate";
import { getChannelDetailsRefetchQueries } from "@dashboard/channels/views/ChannelDetails/channelRefetchQueries";
import { useChannelWarehousesReorder } from "@dashboard/channels/views/ChannelDetails/useChannelWarehouseReorder";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { AssignShippingZoneDialog } from "@dashboard/components/AssignShippingZoneDialog/AssignShippingZoneDialog";
import { AssignWarehouseDialog } from "@dashboard/components/AssignWarehouseDialog/AssignWarehouseDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  type ChannelCreateMutation,
  type ChannelDeleteMutation,
  ChannelErrorCode,
  type ChannelErrorFragment,
  type ChannelUpdateMutation,
  PermissionEnum,
  useChannelActivateMutation,
  useChannelCreateMutation,
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
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getMutationStatus } from "@dashboard/misc";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { messages as channelDetailsPageMessages } from "../../pages/ChannelDetailsPage/messages";
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
  const { refetchUser } = useUser();
  const { refreshChannels } = useAppChannel(false);
  const channelsListData = useChannelsQuery({
    displayLoader: true,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelUrlDialog,
    ChannelUrlQueryParams
  >(navigate, params => channelUrl(id, params), params);

  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
    onCompleted: ({ channelUpdate: { errors } }: ChannelUpdateMutation) => {
      if (errors.length) {
        notify(getDefaultNotifierSuccessErrorData(errors, intl));

        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(channelDetailsPageMessages.channelUpdated),
      });
    },
  });

  const {
    data,
    loading,
    refetch: refetchChannel,
  } = useChannelQuery({
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

        return;
      }

      closeModal();
    },
  });

  const [deactivateChannel, deactivateChannelOpts] = useChannelDeactivateMutation({
    onCompleted: data => {
      const errors = data.channelDeactivate.errors;

      if (errors.length) {
        errors.forEach(error => handleError(error));

        return;
      }

      closeModal();
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
    try {
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
        // Shipping zones are a separate query — without this, Activate stays
        // disabled after Save even though assigns persisted.
        refetchQueries: getChannelDetailsRefetchQueries(id),
        awaitRefetchQueries: true,
      });

      const resultChannel = await updateChannelMutation;
      const errors = await extractMutationErrors(updateChannelMutation);

      if (errors?.length) {
        return errors;
      }

      const reorderErrors = await reorderChannelWarehouses({
        channelId: id,
        warehousesToDisplay,
        warehouses: resultChannel.data?.channelUpdate.channel?.warehouses,
      });

      return reorderErrors;
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });

      return [
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.GRAPHQL_ERROR,
          field: null,
          message: intl.formatMessage(commonMessages.somethingWentWrong),
        },
      ];
    }
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
  const [createChannel, createChannelOpts] = useChannelCreateMutation({
    onCompleted: ({ channelCreate: { errors } }: ChannelCreateMutation) => {
      if (!errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "HA0fD3", defaultMessage: "Channel created" }),
        });
      }
    },
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
  const canManageProducts = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_PRODUCTS]);
  const canCreateWarehouse = canManageProducts;
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
  // Depend on the query result, not the mapped array (new reference every render).
  const channelShippingZoneIds = useMemo(
    () => mapEdgesToItems(channelShippingZonesData?.shippingZones)?.map(zone => zone.id) ?? [],
    [channelShippingZonesData?.shippingZones],
  );
  const duplicateSource = useMemo(
    () =>
      data?.channel ? buildChannelDuplicateSource(data.channel, channelShippingZoneIds) : undefined,
    [channelShippingZoneIds, data],
  );
  const duplicatePrefill = useMemo(
    () =>
      duplicateSource
        ? getChannelDuplicateFormPrefill(duplicateSource, {
            name: intl.formatMessage(createChannelMessages.duplicateName, {
              name: duplicateSource.name,
            }),
          })
        : undefined,
    [duplicateSource, intl],
  );
  const handleDuplicateChannel = async (formData: ChannelCreateFormData) => {
    try {
      const createChannelMutation = createChannel({
        variables: {
          input: buildChannelCreateInput(formData, { duplicateFrom: duplicateSource }),
        },
      });
      const result = await createChannelMutation;
      const errors = await extractMutationErrors(createChannelMutation);
      const channelId = result.data?.channelCreate?.channel?.id;

      if (!errors?.length && channelId) {
        if (refetchUser) {
          await refetchUser();
        }

        // Product-list channel filters resolve against BaseChannels / channel operands.
        await Promise.all([refreshChannels(), channelsListData.refetch()]);

        closeModal();
        navigate(channelUrl(channelId, { action: "setup" }));
      }

      return errors;
    } catch {
      const message = intl.formatMessage(commonMessages.somethingWentWrong);

      notify({
        status: "error",
        text: message,
      });

      return [
        {
          __typename: "ChannelError",
          code: ChannelErrorCode.GRAPHQL_ERROR,
          field: null,
          message,
        },
      ];
    }
  };
  const duplicatePreparing =
    params.action === "duplicate" &&
    (!data?.channel || (canLoadShippingZones && channelsShippingZonesLoading));
  const setupEmphasized = params.action === "setup";
  const {
    isDismissed: setupCardDismissed,
    dismiss: dismissSetupCard,
    undismiss: undismissSetupCard,
  } = useChannelSetupCardDismiss(id);
  const hasWarehouseAssigned = channelWarehouses.length > 0;
  const hasShippingAssigned = (channelShippingZones?.length ?? 0) > 0;
  const coreSetupIncomplete =
    !hasWarehouseAssigned || (canLoadShippingZones && !hasShippingAssigned);
  // Show for post-create / cogs reopen (?action=setup overrides dismiss), incomplete
  // core setup, or inactive channels that still need Activate — not forever on live channels.
  const showSetupCard =
    !!data?.channel &&
    (setupEmphasized || (!setupCardDismissed && (coreSetupIncomplete || !data.channel.isActive)));
  const {
    canFetchApps: canManagePaymentApps,
    paymentApps,
    paymentAppsCount,
    loading: paymentAppsLoading,
    hasMoreApps: hasMorePaymentApps,
  } = useChannelPaymentApps();
  const setupScrollableSectionIds = useMemo((): ChannelSectionId[] => {
    const ids: ChannelSectionId[] = [channelSectionIds.catalog, channelSectionIds.taxes];

    if (canManagePaymentApps) {
      ids.unshift(channelSectionIds.paymentGateways);
    }

    return ids;
  }, [canManagePaymentApps]);
  const {
    publishedProductCount,
    unpublishedProductCount,
    listedInChannelCount,
    totalProductCount,
    recentlyPublishedProducts,
    canViewCatalogStats,
    catalogStatsError,
    loading: catalogStatsLoading,
    refetch: refetchCatalogStats,
  } = useChannelSetupReviewStats({
    channelSlug: data?.channel?.slug,
    skip: !data?.channel,
  });

  const {
    handleCreateWarehouse,
    handleCreateShipping,
    createWarehouseConfirmState,
    createShippingConfirmState,
  } = useChannelSetupActions({
    channelId: id,
    warehouseIds: channelWarehouses.map(warehouse => warehouse.id),
    onWarehouseCreated: closeModal,
    onShippingCreated: closeModal,
    onAssigned: closeModal,
  });

  const assignmentActionsRef = useRef<ChannelAssignmentActions | null>(null);
  const [displayedAssignmentIds, setDisplayedAssignmentIds] =
    useState<ChannelDisplayedAssignmentIds>({
      warehouseIds: [],
      shippingZoneIds: [],
    });
  // Form bridge starts empty until mount — fall back to server counts until then.
  const [hasDisplayedAssignments, setHasDisplayedAssignments] = useState(false);
  const handleDisplayedAssignmentIdsChange = useCallback((ids: ChannelDisplayedAssignmentIds) => {
    setHasDisplayedAssignments(true);
    setDisplayedAssignmentIds(prev => (assignmentIdsEqual(prev, ids) ? prev : ids));
  }, []);
  const setupWarehouseCount = hasDisplayedAssignments
    ? displayedAssignmentIds.warehouseIds.length
    : channelWarehouses.length;
  const setupShippingZoneCount = !canLoadShippingZones
    ? undefined
    : hasDisplayedAssignments
      ? displayedAssignmentIds.shippingZoneIds.length
      : (channelShippingZones?.length ?? 0);
  // Activate must not enable on unsaved staged assigns.
  const activateReady =
    channelWarehouses.length > 0 &&
    (!canLoadShippingZones || (channelShippingZones?.length ?? 0) > 0);

  const displayedWarehouseIds = useMemo(
    () => new Set(displayedAssignmentIds.warehouseIds),
    [displayedAssignmentIds.warehouseIds],
  );
  const displayedShippingZoneIds = useMemo(
    () => new Set(displayedAssignmentIds.shippingZoneIds),
    [displayedAssignmentIds.shippingZoneIds],
  );

  // Exclude server-assigned and form-staged rows so Save-pending picks don't reappear.
  const warehousesToAssign = useMemo(
    () =>
      getParsedSearchData({ data: searchWarehousesResult.data }).filter(
        warehouse => !displayedWarehouseIds.has(warehouse.id),
      ),
    [searchWarehousesResult.data, displayedWarehouseIds],
  );
  const shippingZonesToAssign = useMemo(
    () =>
      getParsedSearchData({ data: searchShippingZonesResult.data }).filter(
        zone => !displayedShippingZoneIds.has(zone.id),
      ),
    [searchShippingZonesResult.data, displayedShippingZoneIds],
  );
  const warehouseAssignFetchMore = getSearchFetchMoreProps(
    searchWarehousesResult,
    fetchMoreWarehouses,
  );
  const shippingAssignFetchMore = getSearchFetchMoreProps(
    searchShippingZonesResult,
    fetchMoreShippingZones,
  );

  if (data?.channel === null) {
    return <NotFoundPage onBack={() => navigate(channelsListUrl())} />;
  }

  const pageDisabled =
    updateChannelOpts.loading ||
    reorderChannelWarehousesOpts.loading ||
    loading ||
    shippingZonesCountLoading ||
    warehousesCountLoading ||
    channelsShippingZonesLoading;

  return (
    <>
      <WindowTitle
        title={
          data?.channel?.name ||
          intl.formatMessage({
            id: "D9Rg+F",
            defaultMessage: "Channel details",
            description: "window title",
          })
        }
      />
      <ChannelDetailsPage
        channelShippingZones={channelShippingZones}
        allShippingZonesCount={shippingZonesCountData?.shippingZones?.totalCount}
        channelWarehouses={channelWarehouses}
        allWarehousesCount={warehousesCountData?.warehouses?.totalCount}
        channel={data?.channel}
        loading={loading}
        disabled={pageDisabled}
        disabledStatus={activateChannelOpts.loading || deactivateChannelOpts.loading}
        errors={updateChannelOpts?.data?.channelUpdate?.errors || []}
        onDelete={() => openModal("remove")}
        onDuplicate={data?.channel?.id ? () => openModal("duplicate") : undefined}
        onShowSetupChecklist={
          data?.channel && !showSetupCard
            ? () => {
                undismissSetupCard();
                openModal("setup");
              }
            : undefined
        }
        onShowMetadata={() => openModal("view-metadata")}
        onSubmit={handleSubmit}
        onToggleChannelStatus={() => openModal(data?.channel?.isActive ? "deactivate" : "activate")}
        assignmentActionsRef={assignmentActionsRef}
        onDisplayedAssignmentIdsChange={handleDisplayedAssignmentIdsChange}
        saveButtonBarState={updateChannelOpts.status}
        countries={shop?.countries || []}
        onCreateWarehouse={() => openModal("create-warehouse")}
        onAssignWarehouse={() => openModal("assign-warehouse")}
        canCreateWarehouse={canCreateWarehouse}
        onCreateShipping={() => openModal("create-shipping")}
        onAssignShipping={() => openModal("assign-shipping")}
        paymentApps={paymentApps}
        paymentAppsLoading={paymentAppsLoading}
        hasMorePaymentApps={hasMorePaymentApps}
        showPaymentGatewaysSection={canManagePaymentApps}
        paymentAppsCount={paymentAppsCount}
        publishedProductCount={publishedProductCount}
        unpublishedProductCount={unpublishedProductCount}
        listedInChannelCount={listedInChannelCount}
        totalProductCount={totalProductCount}
        recentlyPublishedProducts={recentlyPublishedProducts}
        canViewCatalogStats={canViewCatalogStats}
        catalogStatsError={catalogStatsError}
        catalogStatsLoading={catalogStatsLoading}
        onBulkPublishCatalog={canManageProducts ? () => openModal("bulk-publish") : undefined}
        setupCard={
          showSetupCard && data?.channel ? (
            <ChannelSetupCard
              taxConfigurationId={data.channel.taxConfiguration?.id}
              chargeTaxes={data.channel.taxConfiguration?.chargeTaxes}
              taxCalculationStrategy={data.channel.taxConfiguration?.taxCalculationStrategy}
              channelSlug={data.channel.slug}
              channel={{
                id: data.channel.id,
                name: data.channel.name,
                slug: data.channel.slug,
                currencyCode: data.channel.currencyCode,
              }}
              warehouseCount={setupWarehouseCount}
              shippingZoneCount={setupShippingZoneCount}
              availableWarehousesCount={warehousesCountData?.warehouses?.totalCount ?? 0}
              availableShippingZonesCount={shippingZonesCountData?.shippingZones?.totalCount ?? 0}
              paymentAppsCount={paymentAppsCount}
              publishedProductCount={publishedProductCount}
              totalProductCount={totalProductCount}
              scrollableSectionIds={setupScrollableSectionIds}
              isActive={data.channel.isActive}
              activateReady={activateReady}
              canCreateWarehouse={canCreateWarehouse}
              canAssignWarehouse={canLoadWarehouses}
              onAssignWarehouse={() => openModal("assign-warehouse")}
              onCreateWarehouse={() => openModal("create-warehouse")}
              onAssignShipping={() => openModal("assign-shipping")}
              onCreateShipping={() => openModal("create-shipping")}
              onActivate={() => openModal("activate")}
              activateDisabled={activateChannelOpts.loading}
              disabled={pageDisabled}
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
      <CreateChannelDialog
        open={params.action === "duplicate"}
        confirmButtonState={createChannelOpts.status}
        countries={shop?.countries || []}
        disabled={createChannelOpts.loading || duplicatePreparing}
        errors={createChannelOpts?.data?.channelCreate?.errors || []}
        initialValues={duplicatePrefill}
        isDuplicate
        onClose={closeModal}
        onSubmit={handleDuplicateChannel}
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
            onSubmit={selectedWarehouses => {
              // Assign dialog closes itself after onSubmit.
              assignmentActionsRef.current?.assignWarehouses(selectedWarehouses);
            }}
          />
          <AssignShippingZoneDialog
            open={params.action === "assign-shipping"}
            onClose={closeModal}
            shippingZones={shippingZonesToAssign}
            loading={searchShippingZonesResult.loading}
            hasMore={shippingAssignFetchMore.hasMore}
            onFetchMore={shippingAssignFetchMore.onFetchMore}
            onFetch={searchShippingZones}
            onSubmit={selectedZones => {
              assignmentActionsRef.current?.assignShippingZones(selectedZones);
            }}
          />
          <ChannelActivateDialog
            open={params.action === "activate"}
            onClose={closeModal}
            channelName={data.channel.name}
            confirmButtonState={getMutationStatus(activateChannelOpts)}
            onConfirm={() => activateChannel({ variables: { id } })}
          />
          <ChannelDeactivateDialog
            open={params.action === "deactivate"}
            onClose={closeModal}
            channelName={data.channel.name}
            confirmButtonState={getMutationStatus(deactivateChannelOpts)}
            onConfirm={() => deactivateChannel({ variables: { id } })}
          />
          {/* Mounted on demand — the wizard's product search would otherwise run on every page load. */}
          {canManageProducts && params.action === "bulk-publish" && (
            <BulkPublishToChannelDialog
              open
              onClose={closeModal}
              channel={{
                id: data.channel.id,
                name: data.channel.name,
                slug: data.channel.slug,
                currencyCode: data.channel.currencyCode,
              }}
              warehouses={channelWarehouses.map(warehouse => ({
                id: warehouse.id,
                name: warehouse.name,
              }))}
              shopWarehouseCount={warehousesCountData?.warehouses?.totalCount ?? 0}
              onSuccess={() => {
                void refetchCatalogStats();
                void refetchChannel();
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ChannelDetails;
