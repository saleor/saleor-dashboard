// @ts-strict-ignore
import { getChannelsCurrencyChoices } from "@dashboard/channels/utils";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  ChannelDeleteMutation,
  useChannelDeleteMutation,
  useChannelsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import ChannelDeleteDialog from "../../components/ChannelDeleteDialog";
import ChannelsListPage from "../../pages/ChannelsListPage";
import { channelsListUrl, ChannelsListUrlDialog, ChannelsListUrlQueryParams } from "../../urls";

interface ChannelsListProps {
  params: ChannelsListUrlQueryParams;
}

export const ChannelsList = ({ params }: ChannelsListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
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
  const onCompleted = (data: ChannelDeleteMutation) => {
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
    onCompleted,
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

  return (
    <>
      <ChannelsListPage
        channelsList={data?.channels}
        limits={limitOpts.data?.shop.limits}
        onRemove={id =>
          openModal("remove", {
            id,
          })
        }
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
