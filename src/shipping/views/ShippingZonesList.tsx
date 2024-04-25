import { useUser } from "@dashboard/auth";
import ActionDialog from "@dashboard/components/ActionDialog";
import {
  useBulkDeleteShippingZoneMutation,
  useShippingZonesQuery,
  useUpdateDefaultWeightUnitMutation,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Text } from "@saleor/macaw-ui-next";
import isEqual from "lodash/isEqual";
import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ShippingWeightUnitDialog } from "../components/ShippingWeightUnitDialog";
import ShippingZonesListPage from "../components/ShippingZonesListPage";
import {
  shippingZonesListUrl,
  ShippingZonesListUrlDialog,
  ShippingZonesListUrlQueryParams,
} from "../urls";

interface ShippingZonesListProps {
  params: ShippingZonesListUrlQueryParams;
}

export const ShippingZonesList: React.FC<ShippingZonesListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { user } = useUser();
  const { updateListSettings, settings } = useListSettings(ListViews.SHIPPING_METHODS_LIST);
  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);

  usePaginationReset(shippingZonesListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      ...(!!params.query && { filter: { search: params.query } }),
    }),
    [params, settings.rowNumber],
  );
  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingZonesListUrlDialog,
    ShippingZonesListUrlQueryParams
  >(navigate, shippingZonesListUrl, params);
  const { data, loading, refetch } = useShippingZonesQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const shippingZones = mapEdgesToItems(data?.shippingZones);
  const [updateDefaultWeightUnit, updateDefaultWeightUnitOpts] = useUpdateDefaultWeightUnitMutation(
    {
      onCompleted: data => {
        if (data.shopSettingsUpdate?.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          closeModal();
        }
      },
    },
  );
  const [bulkDeleteShippingZone, bulkDeleteShippingZoneOpts] = useBulkDeleteShippingZoneMutation({
    onCompleted: data => {
      if (data.shippingZoneBulkDelete?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        closeModal();
        clearRowSelection();
        refetch();
      }
    },
  });
  const paginationValues = usePaginator({
    pageInfo: data?.shippingZones?.pageInfo,
    paginationState,
    queryString: params,
  });
  const handleSetSelectedShippingZonesIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!shippingZones) {
        return;
      }

      const rowsIds = rows.map(row => shippingZones[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [shippingZones, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );
  const searchHandler = (query: string) => navigate(shippingZonesListUrl({ ...params, query }));

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <ShippingZonesListPage
        defaultWeightUnit={shop?.defaultWeightUnit ?? undefined}
        settings={settings}
        disabled={
          loading || bulkDeleteShippingZoneOpts.loading || updateDefaultWeightUnitOpts.loading
        }
        shippingZones={shippingZones}
        onUpdateListSettings={updateListSettings}
        onSubmit={unit =>
          extractMutationErrors(
            updateDefaultWeightUnit({
              variables: { unit },
            }),
          )
        }
        selectedShippingZonesIds={selectedRowIds}
        onSelectShippingZones={handleSetSelectedShippingZonesIds}
        onRemove={() => openModal("remove", { ids: selectedRowIds })}
        userPermissions={user?.userPermissions || []}
        initialSearch={params.query ?? ""}
        onSearchChange={searchHandler}
        onWeightUnitChange={() => openModal("change-weight-unit")}
      />
      <ShippingWeightUnitDialog
        open={params.action === "change-weight-unit"}
        onSubmit={unit =>
          extractMutationErrors(
            updateDefaultWeightUnit({
              variables: { unit },
            }),
          )
        }
        disabled={updateDefaultWeightUnitOpts.loading}
        onClose={closeModal}
        defaultWeightUnit={shop?.defaultWeightUnit}
      />
      <ActionDialog
        open={params.action === "remove"}
        confirmButtonState={bulkDeleteShippingZoneOpts.status}
        variant="delete"
        title={intl.formatMessage({
          id: "cpZLRH",
          defaultMessage: "Delete Shipping Zones",
          description: "dialog header",
        })}
        onClose={closeModal}
        onConfirm={() =>
          bulkDeleteShippingZone({
            variables: { ids: selectedRowIds ?? "" },
          })
        }
      >
        <Text>
          <FormattedMessage
            id="C9pcQx"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this shipping zone?} other{Are you sure you want to delete {displayQuantity} shipping zones?}}"
            description="dialog content"
            values={{
              counter: selectedRowIds?.length,
              displayQuantity: (
                <strong>{getStringOrPlaceholder(selectedRowIds?.length.toString())}</strong>
              ),
            }}
          />
        </Text>
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};
ShippingZonesList.displayName = "ShippingZonesList";
export default ShippingZonesList;
