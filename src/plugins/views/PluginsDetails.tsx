import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ConfigurationItemInput } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PluginsDetailsPage, {
  PluginDetailsPageFormData
} from "../components/PluginsDetailsPage";
import PluginSecretFieldDialog from "../components/PluginSecretFieldDialog";
import { TypedPluginUpdate } from "../mutations";
import { TypedPluginsDetailsQuery } from "../queries";
import { Plugin_plugin_configuration } from "../types/Plugin";
import { PluginUpdate } from "../types/PluginUpdate";
import {
  pluginListUrl,
  pluginUrl,
  PluginUrlDialog,
  PluginUrlQueryParams
} from "../urls";
import { isSecretField } from "../utils";

export interface PluginsDetailsProps {
  id: string;
  params: PluginUrlQueryParams;
}

export function getConfigurationInput(
  config: Plugin_plugin_configuration[] | null,
  input: ConfigurationItemInput[] | null
): ConfigurationItemInput[] | null {
  if (config === null || input === null) {
    return null;
  }

  return input
    .filter(field => !isSecretField(config, field.name))
    .map(field => ({
      name: field.name,
      value: field.value.toString()
    }));
}

export const PluginsDetails: React.FC<PluginsDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [openModal, closeModal] = createDialogActionHandlers<
    PluginUrlDialog,
    PluginUrlQueryParams
  >(navigate, params => pluginUrl(id, params), params);

  const handleUpdate = (data: PluginUpdate) => {
    if (data.pluginUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      closeModal();
    }
  };

  return (
    <TypedPluginsDetailsQuery variables={{ id }}>
      {pluginDetails => (
        <TypedPluginUpdate onCompleted={handleUpdate}>
          {(pluginUpdate, pluginUpdateOpts) => {
            const formErrors = pluginUpdateOpts.data?.pluginUpdate.errors || [];

            const handleFieldUpdate = (value: string) =>
              pluginUpdate({
                variables: {
                  id,
                  input: {
                    configuration: [
                      {
                        name: params.id,
                        value
                      }
                    ]
                  }
                }
              });

            const handleSubmit = async (
              formData: PluginDetailsPageFormData
            ) => {
              const result = await pluginUpdate({
                variables: {
                  id,
                  input: {
                    active: formData.active,
                    configuration: getConfigurationInput(
                      pluginDetails.data.plugin.configuration,
                      formData.configuration
                    )
                  }
                }
              });

              return result.data.pluginUpdate.errors;
            };

            return (
              <>
                <WindowTitle title={pluginDetails.data?.plugin?.name} />
                <PluginsDetailsPage
                  disabled={pluginDetails.loading}
                  errors={formErrors}
                  saveButtonBarState={
                    !params.action ? pluginUpdateOpts.status : "default"
                  }
                  plugin={pluginDetails.data?.plugin}
                  onBack={() => navigate(pluginListUrl())}
                  onClear={id =>
                    openModal("clear", {
                      id
                    })
                  }
                  onEdit={id =>
                    openModal("edit", {
                      id
                    })
                  }
                  onSubmit={handleSubmit}
                />
                {pluginDetails.data?.plugin?.configuration && (
                  <>
                    <ActionDialog
                      confirmButtonState={
                        !!params.action ? pluginUpdateOpts.status : "default"
                      }
                      onClose={closeModal}
                      open={params.action === "clear" && !!params.id}
                      title={intl.formatMessage({
                        defaultMessage: "Authorization Field Delete",
                        description: "header"
                      })}
                      onConfirm={() => handleFieldUpdate(null)}
                    >
                      <DialogContentText>
                        <FormattedMessage defaultMessage="The plugin may stop working after this field is cleared. Are you sure you want to proceed?" />
                      </DialogContentText>
                    </ActionDialog>
                    <PluginSecretFieldDialog
                      confirmButtonState={
                        !!params.action ? pluginUpdateOpts.status : "default"
                      }
                      field={pluginDetails.data?.plugin?.configuration.find(
                        field => field.name === params.id
                      )}
                      onClose={closeModal}
                      onConfirm={formData => handleFieldUpdate(formData.value)}
                      open={params.action === "edit" && !!params.id}
                    />
                  </>
                )}
              </>
            );
          }}
        </TypedPluginUpdate>
      )}
    </TypedPluginsDetailsQuery>
  );
};
PluginsDetails.displayName = "PluginsDetails";
export default PluginsDetails;
