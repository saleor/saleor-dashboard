import { useTaxConfigurationsListQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

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

  const { data } = useTaxConfigurationsListQuery({ variables: { first: 20 } });

  const taxConfigurations = mapEdgesToItems(data?.taxConfigurations);

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
      taxConfigurations={taxConfigurations}
      selectedConfigurationId={id!}
      handleTabChange={handleTabChange}
    />
  );
};

export default ChannelsList;
