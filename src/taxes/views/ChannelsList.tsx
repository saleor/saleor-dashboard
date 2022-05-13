import { configurationMenuUrl } from "@saleor/configuration";
import { useChannelsQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import TaxChannelsPage from "../components/TaxChannelsPage";
import { channelsListUrl, taxTabSectionUrl } from "../urls";

interface ChannelsListProps {
  id: string;
}

export const ChannelsList: React.FC<ChannelsListProps> = ({ id }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: string) => {
    navigate(taxTabSectionUrl(tab));
  };

  // sample channels data before connecting to new api
  const { data: channelsData } = useChannelsQuery();

  React.useEffect(() => {
    if (id === "undefined" && channelsData?.channels) {
      navigate(channelsListUrl(channelsData.channels[0].id));
    }
  }, [id, channelsData]);

  return (
    <TaxChannelsPage
      // again, sample data before connecting to new api
      data={[
        { id: "129837", name: "Brazil" },
        { id: "9182739", name: "Andora" }
      ]}
      selectedChannelId={id}
      channels={channelsData?.channels}
      handleTabChange={handleTabChange}
      onBack={() => navigate(configurationMenuUrl)}
    />
  );
};

export default ChannelsList;
