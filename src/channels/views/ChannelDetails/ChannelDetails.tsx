// @ts-strict-ignore
import ChannelDeleteDialog from "@dashboard/channels/components/ChannelDeleteDialog";
import { FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { getChannelsCurrencyChoices } from "@dashboard/channels/utils";
import { useChannelWarehousesReorder } from "@dashboard/channels/views/ChannelDetails/useChannelWarehouseReorder";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  ChannelDeleteMutation,
  ChannelErrorFragment,
  ChannelUpdateMutation,
  isMainSchema,
  isStagingSchema,
  useChannelActivateMutation,
  useChannelDeactivateMutation,
  useChannelDeleteMutation,
  useChannelQuery,
  useChannelsQuery,
  useChannelUpdateMutation,
} from "@dashboard/graphql";
import {
  useChannelQuery as useChannelQueryStaging,
  useChannelsQuery as useChannelsQueryStaging,
  useChannelUpdateMutation as useChannelUpdateMutationStaging,
} from "@dashboard/graphql/staging";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@dashboard/hooks/useNotifier/utils";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors } from "@dashboard/misc";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { channelsListUrl, channelUrl, ChannelUrlDialog, ChannelUrlQueryParams } from "../../urls";
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
  const channelsListDataMain = useChannelsQuery({
    displayLoader: true,
    skip: isStagingSchema(),
  });
  const channelsListDataStaging = useChannelsQueryStaging({
    displayLoader: true,
    skip: isMainSchema(),
  });
  const channelsListData = channelsListDataStaging ?? channelsListDataMain;

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelUrlDialog,
    ChannelUrlQueryParams
  >(navigate, params => channelUrl(id, params), params);

  const [updateChannelMain, updateChannelOptsMain] = useChannelUpdateMutation({
    onCompleted: ({ channelUpdate: { errors } }: ChannelUpdateMutation) =>
      notify(getDefaultNotifierSuccessErrorData(errors, intl)),
  });

  const [updateChannelStaging, updateChannelOptsStaging] = useChannelUpdateMutationStaging({
    onCompleted: ({ channelUpdate: { errors } }: ChannelUpdateMutation) =>
      notify(getDefaultNotifierSuccessErrorData(errors, intl)),
  });

  const { data: dataMain, loading: loadingMain } = useChannelQuery({
    displayLoader: true,
    variables: { id },
    skip: isStagingSchema(),
  });

  const { data: dataStaging, loading: loadingStaging } = useChannelQueryStaging({
    displayLoader: true,
    variables: { id },
    skip: isMainSchema(),
  });

  const data = dataStaging ?? dataMain;
  const loading = loadingMain ?? loadingStaging;
  const updateChannelOpts = isStagingSchema() ? updateChannelOptsStaging : updateChannelOptsMain;

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
    defaultCountry,
    defaultTransactionFlowStrategy,
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
  }: FormData) => {
    const updateChannelMutation = isStagingSchema()
      ? updateChannelStaging({
          variables: {
            id: data?.channel.id,
            input: {
              name,
              checkoutSettings: {
                automaticallyCompleteFullyPaidCheckouts: automaticallyCompleteCheckouts,
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
              },
              orderSettings: {
                markAsPaidStrategy,
                deleteExpiredOrdersAfter,
                allowUnpaidOrders,
              },
            },
          },
        })
      : updateChannelMain({
          variables: {
            id: data?.channel.id,
            input: {
              name,
              checkoutSettings: {
                automaticallyCompleteFullyPaidCheckouts: automaticallyCompleteCheckouts,
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
              },
              orderSettings: {
                markAsPaidStrategy,
                deleteExpiredOrdersAfter,
                allowUnpaidOrders,
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

  const {
    shippingZonesCountData,
    shippingZonesCountLoading,
    channelShippingZonesData,
    channelsShippingZonesLoading,
    fetchMoreShippingZones,
    searchShippingZones,
    searchShippingZonesResult,
  } = useShippingZones(id);
  const {
    warehousesCountData,
    warehousesCountLoading,
    fetchMoreWarehouses,
    searchWarehouses,
    searchWarehousesResult,
  } = useWarehouses();

  const channelWarehouses = data?.channel?.warehouses || [];
  const channelShippingZones = mapEdgesToItems(channelShippingZonesData?.shippingZones);

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
        onSubmit={handleSubmit}
        updateChannelStatus={() =>
          data?.channel?.isActive
            ? deactivateChannel({ variables: { id } })
            : activateChannel({ variables: { id } })
        }
        saveButtonBarState={updateChannelOpts.status}
        countries={shop?.countries || []}
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
    </>
  );
};

export default ChannelDetails;
