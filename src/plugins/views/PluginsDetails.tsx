import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import { ConfigurationItemInput } from "@saleor/types/globalTypes";
import { getMutationState, maybe } from "../../misc";
import PluginsDetailsPage from "../components/PluginsDetailsPage";
import { TypedPluginUpdate } from "../mutations";
import { TypedPluginsDetailsQuery } from "../queries";
import { Plugin_plugin_configuration } from "../types/Plugin";
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

  return (
    <TypedPluginUpdate>
      {(pluginUpdate, pluginUpdateOpts) => (
        <TypedPluginsDetailsQuery variables={{ id }}>
          {pluginDetails => {
            const formTransitionState = getMutationState(
              pluginUpdateOpts.called,
              pluginUpdateOpts.loading,
              maybe(() => pluginUpdateOpts.data.pluginUpdate.errors)
            );

            const formErrors = maybe(
              () => pluginUpdateOpts.data.pluginUpdate.errors,
              []
            );

            if (formErrors.length) {
              formErrors.map(error => {
                notify({
                  text: error.message
                });
              });
            } else {
              if (pluginUpdateOpts.data) {
                notify({
                  text: intl.formatMessage({
                    defaultMessage: "Succesfully updated plugin settings",
                    description: "plugin success message"
                  })
                });
              }
            }

            return (
              <>
                <WindowTitle
                  title={maybe(() => pluginDetails.data.plugin.name)}
                />
                <PluginsDetailsPage
                  disabled={pluginDetails.loading}
                  errors={formErrors}
                  saveButtonBarState={formTransitionState}
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
              </>
            );
          }}
        </TypedPluginsDetailsQuery>
      )}
    </TypedPluginUpdate>
  );
};
PluginsDetails.displayName = "PluginsDetails";
export default PluginsDetails;
