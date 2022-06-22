import {
  useTaxConfigurationsListQuery,
  useTaxConfigurationUpdateMutation
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import TaxChannelsPage from "../pages/TaxChannelsPage";
import {
  channelsListUrl,
  TaxesUrlDialog,
  TaxesUrlQueryParams,
  TaxTab,
  taxTabPath
} from "../urls";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface ChannelsListProps {
  id: string | undefined;
  params: TaxesUrlQueryParams | undefined;
}

export const ChannelsList: React.FC<ChannelsListProps> = ({ id, params }) => {
  const navigate = useNavigator();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const [taxConfigurationUpdateMutation] = useTaxConfigurationUpdateMutation();

  const shop = useShop();

  const [openDialog, closeDialog] = createDialogActionHandlers<
    TaxesUrlDialog,
    TaxesUrlQueryParams
  >(navigate, params => channelsListUrl(id, params), params);

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
      allCountries={shop?.countries}
      isDialogOpen={params?.action === "add-country"}
      openDialog={openDialog}
      closeDialog={closeDialog}
      onSubmit={input =>
        taxConfigurationUpdateMutation({
          variables: {
            id,
            input
          }
        })
      }
    />
  );
};

export default ChannelsList;
