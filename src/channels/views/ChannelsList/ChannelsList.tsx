import { configurationMenuUrl } from "@saleor/configuration";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useMemo } from "react";

import ChannelDeleteDialog from "../../components/ChannelDeleteDialog";
import ChannelsListPage from "../../pages/ChannelsListPage";
import { useChannelsList } from "../../queries";
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
  const { data, loading } = useChannelsList({ displayLoader: true });

  const channelsChoices = useMemo(
    () =>
      data?.channels?.map(channel => ({
        label: channel.name,
        value: channel.id
      })),
    [data?.channels?.length]
  );

  const navigateToChannelCreate = () => navigate(channelAddUrl);

  const handleRemoveConfirm = () => null;

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsListUrlDialog,
    ChannelsListUrlQueryParams
  >(navigate, channelsListUrl, params);

  return (
    <>
      <ChannelsListPage
        channelsList={data?.channels}
        disabled={loading}
        navigateToChannelCreate={navigateToChannelCreate}
        onBack={() => navigate(configurationMenuUrl)}
        onRowClick={id => () => navigate(channelUrl(id))}
        onRemove={id =>
          openModal("remove", {
            id
          })
        }
      />
      {!!channelsChoices?.length && (
        <ChannelDeleteDialog
          channelsChoices={channelsChoices}
          open={params.action === "remove"}
          confirmButtonState="default"
          onClose={closeModal}
          onConfirm={handleRemoveConfirm}
        />
      )}
    </>
  );
};

ChannelsList.displayName = "ChannelsList";
export default ChannelsList;
