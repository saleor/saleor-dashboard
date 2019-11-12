import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ConfigurationItemInput } from "@saleor/types/globalTypes";
import { getMutationState, maybe } from "../../misc";
import PluginsDetailsPage from "../components/PluginsDetailsPage";
import PluginSecretFieldDialog from "../components/PluginSecretFieldDialog";
import { TypedPluginUpdate } from "../mutations";
import { TypedPluginsDetailsQuery } from "../queries";
import { Plugin_plugin_configuration } from "../types/Plugin";
import { PluginUpdate } from "../types/PluginUpdate";
import {
  pluginsListUrl,
  pluginsUrl,
  PluginsUrlQueryParams,
  PluginUrlDialog
} from "../urls";
import { isSecretField } from "../utils";

export interface PluginsDetailsProps {
  id: string;
  params: PluginsUrlQueryParams;
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

  const closeModal = () =>
    navigate(
      pluginsUrl(id, {
        ...params,
        action: undefined,
        field: undefined
      }),
      true
    );

  const openModal = (action: PluginUrlDialog, field?: string) =>
    navigate(
      pluginsUrl(id, {
        ...params,
        action,
        field
      })
    );

  const handleUpdate = (data: PluginUpdate) => {
    if (data.pluginUpdate.errors.length === 0) {
      notify({
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
            const formTransitionState = getMutationState(
              pluginUpdateOpts.called,
              pluginUpdateOpts.loading,
              maybe(() => pluginUpdateOpts.data.pluginUpdate.errors)
            );

            const formErrors = maybe(
              () => pluginUpdateOpts.data.pluginUpdate.errors,
              []
            );

            const handleFieldUpdate = (value: string) =>
              pluginUpdate({
                variables: {
                  id,
                  input: {
                    configuration: [
                      {
                        name: params.field,
                        value
                      }
                    ]
                  }
                }
              });

            return (
              <>
                <WindowTitle
                  title={maybe(() => pluginDetails.data.plugin.name)}
                />
                <PluginsDetailsPage
                  disabled={pluginDetails.loading}
                  errors={formErrors}
                  saveButtonBarState={
                    !params.action ? formTransitionState : "default"
                  }
                  plugin={maybe(() => pluginDetails.data.plugin)}
                  onBack={() => navigate(pluginsListUrl())}
                  onClear={field => openModal("clear", field)}
                  onEdit={field => openModal("edit", field)}
                  onSubmit={formData =>
                    pluginUpdate({
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
                    })
                  }
                />
                {maybe(() => pluginDetails.data.plugin.configuration) && (
                  <>
                    <ActionDialog
                      confirmButtonState={
                        !!params.action ? formTransitionState : "default"
                      }
                      onClose={closeModal}
                      open={params.action === "clear" && !!params.field}
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
                        !!params.action ? formTransitionState : "default"
                      }
                      field={maybe(() =>
                        pluginDetails.data.plugin.configuration.find(
                          field => field.name === params.field
                        )
                      )}
                      onClose={closeModal}
                      onConfirm={formData => handleFieldUpdate(formData.value)}
                      open={params.action === "edit" && !!params.field}
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
