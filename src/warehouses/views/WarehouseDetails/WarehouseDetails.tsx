import NotFoundPage from "@dashboard/components/NotFoundPage/NotFoundPage";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useWarehouseDeleteMutation,
  useWarehouseDetailsQuery,
  useWarehouseUpdateMutation,
  type WarehouseDetailsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors, getMutationStatus, getStringOrPlaceholder } from "@dashboard/misc";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { WarehouseDeleteDialog } from "@dashboard/warehouses/components/WarehouseDeleteDialog/WarehouseDeleteDialog";
import { type WarehouseDetailsPageFormData } from "@dashboard/warehouses/components/WarehouseDetailsPage/types";
import { WarehouseDetailsPage } from "@dashboard/warehouses/components/WarehouseDetailsPage/WarehouseDetailsPage";
import { WarehouseDetailsPageLoading } from "@dashboard/warehouses/components/WarehouseDetailsPage/WarehouseDetailsPageLoading";
import { WarehouseMetadataDialog } from "@dashboard/warehouses/components/WarehouseMetadataDialog/WarehouseMetadataDialog";
import { useLegacyStockAvailability } from "@dashboard/warehouses/hooks/useLegacyStockAvailability";
import { useWarehouseDetailsChannels } from "@dashboard/warehouses/hooks/useWarehouseDetailsChannels";
import { useWarehouseShippingZoneAssignment } from "@dashboard/warehouses/hooks/useWarehouseShippingZoneAssignment";
import { useWarehouseStockCount } from "@dashboard/warehouses/hooks/useWarehouseStockCount";
import {
  warehouseListUrl,
  warehouseUrl,
  type WarehouseUrlQueryParams,
} from "@dashboard/warehouses/urls";
import { warehouseAddressInput } from "@dashboard/warehouses/warehouseInputFromForm";
import { warehouseZoneMemberships } from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

interface WarehouseDetailsProps {
  id: string;
  params: WarehouseUrlQueryParams;
}

const WarehouseDetails = ({ id, params }: WarehouseDetailsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { trackEvent } = useAnalytics();
  const notify = useNotifier();
  const shop = useShop();
  const { data, loading, error, refetch } = useWarehouseDetailsQuery({
    displayLoader: true,
    variables: { id },
  });
  const legacyStockAvailability = useLegacyStockAvailability();
  const { stockCount, loading: stockCountLoading } = useWarehouseStockCount(id);
  const shippingZones = warehouseZoneMemberships(data?.warehouse?.shippingZones);
  const [openModal, closeModal] = createDialogActionHandlers(
    navigate,
    params => warehouseUrl(id, params),
    params,
  );
  // Checklist is rendered inside the channels hook; zone assign opens after that hook runs.
  const openZoneAssignRef = useRef<() => void>(() => undefined);
  const channels = useWarehouseDetailsChannels({
    warehouseId: id,
    legacyStockAvailability,
    zones: shippingZones.zones,
    zonesTruncated: shippingZones.truncated,
    checklistEmphasized: !!data?.warehouse && params.action === "setup",
    onDismissChecklist: () => {
      if (params.action === "setup") {
        closeModal();
      }
    },
    onOpenShippingZones: () => openZoneAssignRef.current(),
    onChannelRemoved: async () => {
      await refetch();
    },
  });
  const zoneAssignment = useWarehouseShippingZoneAssignment({
    warehouseId: id,
    channelIds: channels.warehouseChannelIds,
    assignedZoneIds: shippingZones.zones.map(zone => zone.id),
    onChanged: async () => {
      await refetch();
    },
  });

  useEffect(
    function syncZoneAssignOpener() {
      openZoneAssignRef.current = zoneAssignment.openAssign;
    },
    [zoneAssignment.openAssign],
  );

  const [updateWarehouse, updateWarehouseOpts] = useWarehouseUpdateMutation({
    onCompleted: data => {
      if (data?.updateWarehouse?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "arT1bu", defaultMessage: "Warehouse updated" }),
        });
      }
    },
  });
  const updateWarehouseTransitionState = getMutationStatus(updateWarehouseOpts);
  const [deleteWarehouse, deleteWarehouseOpts] = useWarehouseDeleteMutation({
    onCompleted: data => {
      if (data?.deleteWarehouse?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "MzXzjL", defaultMessage: "Warehouse deleted" }),
        });
        navigate(warehouseListUrl());
      }
    },
  });
  const deleteWarehouseTransitionState = getMutationStatus(deleteWarehouseOpts);

  if (data?.warehouse === null) {
    return <NotFoundPage onBack={() => navigate(warehouseListUrl())} />;
  }

  if (warehouseLoadFailed({ data, error, loading })) {
    return (
      <WarehouseDetailsPageLoading
        channelsCard={channels.card}
        onRetry={() => {
          refetch().catch(() => undefined);
        }}
      />
    );
  }

  const handleSubmit = async (data: WarehouseDetailsPageFormData) =>
    extractMutationErrors(
      updateWarehouse({
        variables: {
          id,
          input: {
            address: warehouseAddressInput(data),
            name: data.name,
            email: data.email,
            isPrivate: data.isPrivate,
            clickAndCollectOption: data.clickAndCollectOption,
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle title={getStringOrPlaceholder(data?.warehouse?.name)} />
      <WarehouseDetailsPage
        countries={shop?.countries || []}
        disabled={loading || updateWarehouseOpts.loading}
        errors={updateWarehouseOpts.data?.updateWarehouse?.errors || []}
        saveButtonBarState={updateWarehouseTransitionState}
        warehouse={data?.warehouse}
        legacyStockAvailability={legacyStockAvailability}
        stockCount={stockCount}
        stockCountLoading={stockCountLoading}
        channelsCard={channels.card}
        channelBanner={channels.banner}
        channelSubtitle={channels.subtitle}
        membershipStatus={channels.status}
        warehouseChannelIds={channels.warehouseChannelIds}
        channelNames={channels.channelNames}
        canManageShippingZones={zoneAssignment.canManage}
        shippingZonesDisabled={zoneAssignment.busy}
        onRequestAssignZones={zoneAssignment.openAssign}
        onRemoveShippingZone={zoneAssignment.remove}
        onShowAllShippingZones={zoneAssignment.openAll}
        onDelete={() => openModal("delete")}
        onShowMetadata={() => openModal("view-warehouse-metadata")}
        onShowSetupChecklist={
          data?.warehouse && channels.status === "ready" && !channels.checklistVisible
            ? () => {
                trackEvent("setup_checklist_reopened", { entity_type: "warehouse" });
                openModal("setup");
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />
      {zoneAssignment.dialog}
      <WarehouseDeleteDialog
        confirmButtonState={deleteWarehouseTransitionState}
        name={getStringOrPlaceholder(data?.warehouse?.name)}
        stockCount={stockCount}
        channelCount={channels.status === "ready" ? channels.warehouseChannelIds.length : null}
        onClose={closeModal}
        onConfirm={() =>
          deleteWarehouse({
            variables: { id },
          })
        }
        open={params.action === "delete"}
      />
      <WarehouseMetadataDialog
        open={params.action === "view-warehouse-metadata"}
        onClose={closeModal}
        warehouse={data?.warehouse}
      />
    </>
  );
};

WarehouseDetails.displayName = "WarehouseDetails";
export default WarehouseDetails;

/** The query finished with an error and no warehouse to show. */
const warehouseLoadFailed = ({
  data,
  error,
  loading,
}: {
  data: WarehouseDetailsQuery | undefined;
  error: unknown;
  loading: boolean;
}): boolean => !data?.warehouse && !!error && !loading;
