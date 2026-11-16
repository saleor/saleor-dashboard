// @ts-strict-ignore
import {
  useTaxConfigurationsListQuery,
  useTaxConfigurationUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useIntl } from "react-intl";

import { TaxConfigurationMetadataDialog } from "../components/TaxConfigurationMetadataDialog/TaxConfigurationMetadataDialog";
import TaxChannelsPage from "../pages/TaxChannelsPage/TaxChannelsPage";
import {
  taxConfigurationListUrl,
  type TaxesUrlDialog,
  type TaxesUrlQueryParams,
  type TaxTab,
  taxTabPath,
} from "../urls";
import { useCanEditTaxConfigurationMetadata } from "../utils/useCanEditTaxConfigurationMetadata";
import { useTaxUrlRedirect } from "../utils/useTaxUrlRedirect";

interface TaxChannelsListProps {
  id: string | undefined;
  params: TaxesUrlQueryParams | undefined;
}

const TaxChannelsList = ({ id, params }: TaxChannelsListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const handleTabChange = (tab: TaxTab) => {
    navigate(taxTabPath(tab));
  };
  const [taxConfigurationUpdateMutation, { status: mutationStatus, loading: mutationInProgress }] =
    useTaxConfigurationUpdateMutation({
      onCompleted: data => {
        const errors = data?.taxConfigurationUpdate?.errors;

        if (errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({ id: "MpOBnD", defaultMessage: "Tax settings updated" }),
          });
        }
      },
    });
  const shop = useShop();
  const [openDialog, closeDialog] = createDialogActionHandlers<TaxesUrlDialog, TaxesUrlQueryParams>(
    navigate,
    params => taxConfigurationListUrl(id, params),
    params,
  );
  const { data } = useTaxConfigurationsListQuery({ variables: { first: 100 } });
  const taxConfigurations = mapEdgesToItems(data?.taxConfigurations);
  const selectedTaxConfiguration = taxConfigurations?.find(
    taxConfiguration => taxConfiguration.id === id,
  );
  const canEditMetadata = useCanEditTaxConfigurationMetadata();

  useTaxUrlRedirect({
    id,
    data: taxConfigurations,
    urlFunction: taxConfigurationListUrl,
    navigate,
  });

  if (id === "undefined" && taxConfigurations) {
    return null;
  }

  return (
    <>
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
              input,
            },
          })
        }
        savebarState={mutationStatus}
        disabled={mutationInProgress}
        onShowMetadata={canEditMetadata ? (): void => openDialog("view-metadata") : undefined}
      />
      {selectedTaxConfiguration ? (
        <TaxConfigurationMetadataDialog
          // A shared link can carry the action for a user without tax permissions.
          open={canEditMetadata && params?.action === "view-metadata"}
          onClose={closeDialog}
          taxConfigurationId={selectedTaxConfiguration.id}
          channelName={selectedTaxConfiguration.channel.name}
        />
      ) : null}
    </>
  );
};

export default TaxChannelsList;
