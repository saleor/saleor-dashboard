import { configurationMenuUrl } from "@saleor/configuration";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import MultichannelsListPage from "../../pages/MultichannelsListPage";
import { useChannelsList } from "../../queries";
import {
  channelAddUrl,
  channelsListUrl,
  channelUrl,
  MultichannelsListUrlQueryParams
} from "../../urls";

interface MultichannelsListProps {
  params: MultichannelsListUrlQueryParams;
}

export const MultichannelsList: React.FC<MultichannelsListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  // const notify = useNotifier();
  const { data, loading } = useChannelsList({ displayLoader: true });

  const navigateToChannelCreate = () => navigate(channelAddUrl);

  const onRemove = () => null;

  const handleSearchChange = (query: string) => {
    navigate(
      channelsListUrl({
        ...params,
        query
      })
    );
  };

  return (
    <MultichannelsListPage
      channelsList={data?.channels}
      initialSearch={params.query || ""}
      disabled={loading}
      navigateToChannelCreate={navigateToChannelCreate}
      onBack={() => navigate(configurationMenuUrl)}
      onRowClick={id => () => navigate(channelUrl(id))}
      onRemove={onRemove}
      onSearchChange={handleSearchChange}
    />
  );
};

export default MultichannelsList;
