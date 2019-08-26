import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import i18n from "../../i18n";
import { getMutationState, maybe } from "../../misc";
import { PluginConfigurationUpdateInput } from "../../types/globalTypes";
import PluginsDetailsPage, { FormData } from "../components/PluginsDetailsPage";
import { TypedPluginConfigurationUpdate } from "../mutations";
import { TypedPluginsDetailsQuery } from "../queries";
import { pluginsListUrl, pluginsUrl, PluginsUrlQueryParams } from "../urls";

export interface PluginsDetailsProps {
  id: string;
  params: PluginsUrlQueryParams;
}

export const PluginsDetails: React.StatelessComponent<PluginsDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();

  return (
    <TypedPluginConfigurationUpdate>
      {(pluginConfigurationUpdate, pluginConfigurationUpdateOpts) => (
        <TypedPluginsDetailsQuery variables={{ id }}>
          {PluginDetails => {
            const formTransitionState = getMutationState(
              pluginConfigurationUpdateOpts.called,
              pluginConfigurationUpdateOpts.loading,
              maybe(
                () =>
                  pluginConfigurationUpdateOpts.data.pluginConfiguration.errors
              )
            );

            return (
              <>
                <WindowTitle
                  title={maybe(
                    () => PluginDetails.data.pluginConfiguration.name
                  )}
                />
                <PluginsDetailsPage
                  disabled={PluginDetails.loading}
                  errors={maybe(
                    () =>
                      pluginConfigurationUpdateOpts.data.pluginConfiguration
                        .errors,
                    []
                  )}
                  saveButtonBarState={formTransitionState}
                  plugin={maybe(() => PluginDetails.data.pluginConfiguration)}
                  onBack={() => navigate(pluginsListUrl())}
                  onSubmit={formData => {
                    const configurationInput = [];
                    formData.configuration.map(item => {
                      configurationInput.push({
                        name: item.name,
                        value: item.value
                      });
                    });
                    pluginConfigurationUpdate({
                      variables: {
                        id,
                        input: {
                          active: formData.active,
                          configuration: configurationInput
                        }
                      }
                    });
                  }}
                />
              </>
            );
          }}
        </TypedPluginsDetailsQuery>
      )}
    </TypedPluginConfigurationUpdate>
  );
};
PluginsDetails.displayName = "PluginsDetails";
export default PluginsDetails;
