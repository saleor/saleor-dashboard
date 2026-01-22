import {
  useTaxConfigurationsListQuery,
  useTaxConfigurationUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useIntl } from "react-intl";

import TaxChannelsPage from "../pages/TaxChannelsPage";
import {
  taxConfigurationListUrl,
  TaxesUrlDialog,
  TaxesUrlQueryParams,
  TaxTab,
  taxTabPath,
} from "../urls";
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

        if (errors && errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });
  const shop = useShop();
  const [openDialog, closeDialog] = createDialogActionHandlers<TaxesUrlDialog, TaxesUrlQueryParams>(
    navigate,
    params => taxConfigurationListUrl(id, params),
    params ?? {},
  );
  const { data } = useTaxConfigurationsListQuery({ variables: { first: 100 } });
  const taxConfigurations = mapEdgesToItems(data?.taxConfigurations);

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
    <TaxChannelsPage
      taxConfigurations={taxConfigurations}
      selectedConfigurationId={id ?? ""}
      handleTabChange={(tab: string) => handleTabChange(tab as TaxTab)}
      allCountries={shop?.countries}
      isDialogOpen={params?.action === "add-country"}
      openDialog={(action?: string) => openDialog(action as TaxesUrlDialog)}
      closeDialog={closeDialog}
      onSubmit={input =>
        taxConfigurationUpdateMutation({
          variables: {
            id: id ?? "",
            input,
          },
        })
      }
      savebarState={mutationStatus}
      disabled={mutationInProgress}
    />
  );
};

export default TaxChannelsList;
