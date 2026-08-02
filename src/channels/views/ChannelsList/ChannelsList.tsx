// @ts-strict-ignore
import { useUser } from "@dashboard/auth/useUser";
import { CreateChannelDialog } from "@dashboard/channels/components/CreateChannelDialog/CreateChannelDialog";
import { type ChannelCreateFormData } from "@dashboard/channels/components/CreateChannelDialog/types";
import { getChannelsCurrencyChoices } from "@dashboard/channels/utils";
import { buildChannelCreateInput } from "@dashboard/channels/utils/buildChannelCreateInput";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  type ChannelCreateMutation,
  type ChannelDeleteMutation,
  useChannelCreateMutation,
  useChannelDeleteMutation,
  useChannelsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors } from "@dashboard/misc";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useIntl } from "react-intl";

import { ChannelDeleteDialog } from "../../components/ChannelDeleteDialog";
import ChannelsListPage from "../../pages/ChannelsListPage";
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
  const { data, refetch } = useChannelsQuery({ displayLoader: true });
  const limitOpts = useShopLimitsQuery({
    variables: {
      channels: true,
    },
  });
  const selectedChannel = data?.channels?.find(channel => channel.id === params?.id);
  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsListUrlDialog,
    ChannelsListUrlQueryParams
  >(navigate, channelsListUrl, params);
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
        input: buildChannelCreateInput(formData),
      },
    });
    const result = await createChannelMutation;
    const errors = await extractMutationErrors(createChannelMutation);
    const channelId = result.data?.channelCreate?.channel?.id;

    if (!errors?.length && channelId) {
      if (refetchUser) {
        await refetchUser();
      }

      limitOpts.refetch();
      closeModal();
      navigate(channelUrl(channelId, { action: "setup" }));
    }

    return errors;
  };

  return (
    <>
      <ChannelsListPage
        channelsList={data?.channels}
        limits={limitOpts.data?.shop.limits}
        onAddChannel={() => openModal("create")}
        onRemove={id =>
          openModal("remove", {
            id,
          })
        }
      />

      <CreateChannelDialog
        open={params.action === "create"}
        confirmButtonState={createChannelOpts.status}
        countries={shop?.countries || []}
        disabled={createChannelOpts.loading}
        errors={createChannelOpts?.data?.channelCreate?.errors || []}
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
