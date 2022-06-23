import {
  useTaxConfigurationsListQuery,
  useTaxConfigurationUpdateMutation
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { taxesMessages } from "../messages";
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
  const notify = useNotifier();
  const intl = useIntl();

  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };

  const [
    taxConfigurationUpdateMutation,
    { status: mutationStatus, loading: mutationInProgress }
  ] = useTaxConfigurationUpdateMutation({
    onCompleted: data => {
      const errors = data?.taxConfigurationUpdate?.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      } else {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.defaultErrorTitle)
        });
      }
    }
  });

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
      savebarState={mutationStatus}
      disabled={mutationInProgress}
    />
  );
};

export default ChannelsList;
