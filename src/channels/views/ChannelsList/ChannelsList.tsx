// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { useUser } from "@dashboard/auth/useUser";
import { CreateChannelDialog } from "@dashboard/channels/components/CreateChannelDialog/CreateChannelDialog";
import { messages as createChannelMessages } from "@dashboard/channels/components/CreateChannelDialog/messages";
import { type ChannelCreateFormData } from "@dashboard/channels/components/CreateChannelDialog/types";
import { useChannelsListShippingZoneCounts } from "@dashboard/channels/hooks/useChannelsListShippingZoneCounts";
import { getChannelsCurrencyChoices } from "@dashboard/channels/utils";
import { buildChannelCreateInput } from "@dashboard/channels/utils/buildChannelCreateInput";
import {
  buildChannelDuplicateSource,
  getChannelDuplicateFormPrefill,
} from "@dashboard/channels/utils/channelDuplicate";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  type ChannelCreateMutation,
  type ChannelDeleteMutation,
  PermissionEnum,
  useChannelCreateMutation,
  useChannelDeleteMutation,
  useChannelShippingZonesQuery,
  useChannelsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors } from "@dashboard/misc";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { ChannelDeleteDialog } from "../../components/ChannelDeleteDialog";
import { ChannelsListPage } from "../../pages/ChannelsListPage";
import {
  channelsListUrl,
  type ChannelsListUrlDialog,
  type ChannelsListUrlQueryParams,
  channelUrl,
} from "../../urls";

interface ChannelsListProps {
  params: ChannelsListUrlQueryParams;
}

const ChannelsList = ({ params }: ChannelsListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const { refetchUser } = useUser();
  const { refreshChannels } = useAppChannel(false);
  const userPermissions = useUserPermissions();
  const canLoadShippingZones = hasPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_SHIPPING,
  ]);
  const { data, refetch } = useChannelsQuery({ displayLoader: true });
  const { shippingZoneCountsByChannelId, shippingCoverageLoading } =
    useChannelsListShippingZoneCounts({
      skip: !canLoadShippingZones,
    });
  const limitOpts = useShopLimitsQuery({
    variables: {
      channels: true,
    },
  });
  const selectedChannel = data?.channels?.find(channel => channel.id === params?.id);
  const duplicateFromId = params.action === "create" ? params.from : undefined;
  const sourceChannel = data?.channels?.find(channel => channel.id === duplicateFromId);
  const { data: duplicateZonesData, loading: duplicateZonesLoading } = useChannelShippingZonesQuery(
    {
      variables: {
        filter: {
          channels: duplicateFromId ? [duplicateFromId] : [],
        },
      },
      skip: !duplicateFromId || !canLoadShippingZones,
    },
  );
  const duplicateShippingZoneIds = useMemo(
    () => mapEdgesToItems(duplicateZonesData?.shippingZones)?.map(zone => zone.id) ?? [],
    [duplicateZonesData?.shippingZones],
  );
  const duplicateSource = useMemo(
    () =>
      sourceChannel
        ? buildChannelDuplicateSource(sourceChannel, duplicateShippingZoneIds)
        : undefined,
    [duplicateShippingZoneIds, sourceChannel],
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
  // Clear `from` on close so a later "Create channel" doesn't keep cloning.
  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsListUrlDialog,
    ChannelsListUrlQueryParams
  >(navigate, channelsListUrl, params, ["from"]);
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
      refetch();
      limitOpts.refetch();
      closeModal();
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
  const channelsChoices = getChannelsCurrencyChoices(params.id, selectedChannel, data?.channels);
  const handleRemoveConfirm = (channelId?: string) => {
    const inputVariables = channelId ? { input: { channelId } } : {};

    deleteChannel({
      variables: {
        id: params.id,
        ...inputVariables,
      },
    });
  };
  const handleCreateChannel = async (formData: ChannelCreateFormData) => {
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

      await Promise.all([refreshChannels(), refetch()]);
      limitOpts.refetch();
      closeModal();
      navigate(channelUrl(channelId, { action: "setup" }));
    }

    return errors;
  };
  const isDuplicate = Boolean(duplicateFromId);
  const duplicatePreparing =
    isDuplicate && (!sourceChannel || (canLoadShippingZones && duplicateZonesLoading));
  const handleSort = createSortHandler(navigate, channelsListUrl, params);

  return (
    <>
      <ChannelsListPage
        channelsList={data?.channels}
        limits={limitOpts.data?.shop.limits}
        shippingZoneCountsByChannelId={shippingZoneCountsByChannelId}
        shippingCoverageLoading={shippingCoverageLoading}
        sort={getSortParams(params)}
        onSort={handleSort}
        onAddChannel={() => openModal("create", { from: undefined })}
        onRemove={id =>
          openModal("remove", {
            id,
            from: undefined,
          })
        }
      />

      <CreateChannelDialog
        key={`${duplicateFromId ?? "create"}:${duplicatePrefill?.slug ?? ""}`}
        open={params.action === "create"}
        confirmButtonState={createChannelOpts.status}
        countries={shop?.countries || []}
        disabled={createChannelOpts.loading || duplicatePreparing}
        errors={createChannelOpts?.data?.channelCreate?.errors || []}
        initialValues={duplicatePrefill}
        isDuplicate={isDuplicate}
        onClose={closeModal}
        onSubmit={handleCreateChannel}
      />

      {!!selectedChannel && (
        <ChannelDeleteDialog
          currency={selectedChannel.currencyCode}
          channelsChoices={channelsChoices}
          channelSlug={selectedChannel?.slug}
          hasOrders={selectedChannel.hasOrders}
          open={params.action === "remove"}
          confirmButtonState={deleteChannelOpts.status}
          onBack={() => navigate(channelsListUrl())}
          onClose={closeModal}
          onConfirm={handleRemoveConfirm}
        />
      )}
    </>
  );
};

ChannelsList.displayName = "ChannelsList";
export default ChannelsList;
