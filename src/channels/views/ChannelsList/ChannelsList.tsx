import { configurationMenuUrl } from "@saleor/configuration";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import getChannelsErrorMessage from "@saleor/utils/errors/channels";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import ChannelDeleteDialog from "../../components/ChannelDeleteDialog";
import { useChannelDeleteMutation } from "../../mutations";
import ChannelsListPage from "../../pages/ChannelsListPage";
import { useChannelsList } from "../../queries";
import { ChannelDelete } from "../../types/ChannelDelete";
import {
  channelAddUrl,
  channelsListUrl,
  ChannelsListUrlDialog,
  ChannelsListUrlQueryParams,
  channelUrl
} from "../../urls";

interface ChannelsListProps {
  params: ChannelsListUrlQueryParams;
}

export const ChannelsList: React.FC<ChannelsListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, refetch } = useChannelsList({ displayLoader: true });

  const selectedChannel = data?.channels.find(
    channel => channel.id === params?.id
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsListUrlDialog,
    ChannelsListUrlQueryParams
  >(navigate, channelsListUrl, params);

  const onCompleted = (data: ChannelDelete) => {
    const errors = data.channelDelete.errors;
    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Channel deleted"
        })
      });
      refetch();
      closeModal();
    } else {
      errors.map(error =>
        notify({
          status: "error",
          text: getChannelsErrorMessage(error, intl)
        })
      );
    }
  };

  const [deleteChannel, deleteChannelOpts] = useChannelDeleteMutation({
    onCompleted
  });

  const channelsChoices = params.id
    ? data?.channels
        ?.filter(
          channel =>
            channel.id !== params.id &&
            channel.currencyCode === selectedChannel.currencyCode
        )
        .map(channel => ({
          label: channel.name,
          value: channel.id
        }))
    : [];

  const navigateToChannelCreate = () => navigate(channelAddUrl);

  const handleRemoveConfirm = (id: string) =>
    deleteChannel({
      variables: { id: params.id, input: { targetChannel: id } }
    });

  return (
    <>
      <ChannelsListPage
        channelsList={data?.channels}
        navigateToChannelCreate={navigateToChannelCreate}
        onBack={() => navigate(configurationMenuUrl)}
        onRowClick={id => () => navigate(channelUrl(id))}
        onRemove={id =>
          openModal("remove", {
            id
          })
        }
      />

      {!!selectedChannel && (
        <ChannelDeleteDialog
          channelsChoices={channelsChoices}
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
