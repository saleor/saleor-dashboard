import NotFoundPage from "@dashboard/components/NotFoundPage/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CountryCode,
  useWarehouseDeleteMutation,
  useWarehouseDetailsQuery,
  useWarehouseStockAvailabilityModeQuery,
  useWarehouseStockCountQuery,
  useWarehouseUpdateMutation,
  type WarehouseDetailsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import {
  extractMutationErrors,
  findValueInEnum,
  getMutationStatus,
  getStringOrPlaceholder,
} from "@dashboard/misc";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { WarehouseDeleteDialog } from "@dashboard/warehouses/components/WarehouseDeleteDialog/WarehouseDeleteDialog";
import {
  WarehouseDetailsPage,
  type WarehouseDetailsPageFormData,
} from "@dashboard/warehouses/components/WarehouseDetailsPage/WarehouseDetailsPage";
import { WarehouseMetadataDialog } from "@dashboard/warehouses/components/WarehouseMetadataDialog/WarehouseMetadataDialog";
import { useWarehouseDetailsChannels } from "@dashboard/warehouses/hooks/useWarehouseDetailsChannels";
import {
  warehouseListUrl,
  warehouseUrl,
  type WarehouseUrlQueryParams,
} from "@dashboard/warehouses/urls";
import { type ZoneChannelMembership } from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { useIntl } from "react-intl";

interface WarehouseDetailsProps {
  id: string;
  params: WarehouseUrlQueryParams;
}

const WarehouseDetails = ({ id, params }: WarehouseDetailsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { data, loading } = useWarehouseDetailsQuery({
    displayLoader: true,
    variables: { id },
  });
  const { legacyStockAvailability, stockCount, stockCountLoading } =
    useWarehouseDetailsSideData(id);
  const shippingZones = warehouseZoneMemberships(data?.warehouse?.shippingZones);
  const channels = useWarehouseDetailsChannels({
    warehouseId: id,
    legacyStockAvailability,
    zones: shippingZones.zones,
    zonesTruncated: shippingZones.truncated,
  });
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
  const [openModal, closeModal] = createDialogActionHandlers(
    navigate,
    params => warehouseUrl(id, params),
    params,
  );

  if (data?.warehouse === null) {
    return <NotFoundPage onBack={() => navigate(warehouseListUrl())} />;
  }

  const handleSubmit = async (data: WarehouseDetailsPageFormData) =>
    extractMutationErrors(
      updateWarehouse({
        variables: {
          id,
          input: {
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
        onDelete={() => openModal("delete")}
        onShowMetadata={() => openModal("view-warehouse-metadata")}
        onSubmit={handleSubmit}
      />
      <WarehouseDeleteDialog
        confirmButtonState={deleteWarehouseTransitionState}
        name={getStringOrPlaceholder(data?.warehouse?.name)}
        stockCount={stockCountLoading ? null : stockCount}
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

const warehouseZoneMemberships = (
  shippingZones:
    | NonNullable<WarehouseDetailsQuery["warehouse"]>["shippingZones"]
    | null
    | undefined,
): { zones: ZoneChannelMembership[]; truncated: boolean } => {
  const zones = (mapEdgesToItems(shippingZones) ?? []).map(zone => ({
    id: zone.id,
    name: zone.name,
    channelIds: zone.channels.map(channel => channel.id),
  }));

  return {
    zones,
    truncated: (shippingZones?.totalCount ?? 0) > zones.length,
  };
};

const useWarehouseDetailsSideData = (
  id: string,
): {
  legacyStockAvailability: boolean | undefined;
  stockCount: number | null;
  stockCountLoading: boolean;
} => {
  const stockCountQuery = useWarehouseStockCountQuery({
    variables: { id },
    errorPolicy: "all",
  });
  const stockModeQuery = useWarehouseStockAvailabilityModeQuery();
  const legacyValue = stockModeQuery.data?.shop?.useLegacyShippingZoneStockAvailability;

  return {
    legacyStockAvailability: stockModeQuery.loading ? undefined : (legacyValue ?? false),
    stockCount: stockCountQuery.data?.warehouse?.stocks?.totalCount ?? null,
    stockCountLoading: stockCountQuery.loading,
  };
};
