import React from "react";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import { getMutationState, maybe } from "../../misc";
import PluginsDetailsPage from "../components/PluginsDetailsPage";
import { TypedPluginConfigurationUpdate } from "../mutations";
import { TypedPluginsDetailsQuery } from "../queries";
import { pluginsListUrl, PluginsListUrlQueryParams } from "../urls";

export interface PluginsDetailsProps {
  id: string;
  params: PluginsListUrlQueryParams;
}

export const PluginsDetails: React.StatelessComponent<PluginsDetailsProps> = ({
  id
}) => {
  const navigate = useNavigator();

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
                  pluginConfigurationUpdateOpts.data.pluginConfigurationUpdate
                    .errors
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
                      pluginConfigurationUpdateOpts.data
                        .pluginConfigurationUpdate.errors,
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
                        value: item.value.toString()
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
