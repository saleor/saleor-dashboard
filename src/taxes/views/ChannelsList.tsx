import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import { taxConfigurations } from "../fixtures";
import TaxChannelsPage from "../pages/TaxChannelsPage";
import { channelsListUrl, taxTabSectionUrl } from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface ChannelsListProps {
  id: string | undefined;
}

export const ChannelsList: React.FC<ChannelsListProps> = ({ id }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: string) => {
    navigate(taxTabSectionUrl(tab));
  };

  useTaxUrlRedirect({
    id,
    data: taxConfigurations,
    urlFunction: channelsListUrl,
    navigate
  });

  if (id === "undefined" && taxConfigurations) {
    return null;
  }

  return (
    <TaxChannelsPage
      taxConfigurations={taxConfigurations} // TODO: change fixture to query data
      selectedConfigurationId={id!}
      handleTabChange={handleTabChange}
    />
  );
};

export default ChannelsList;
