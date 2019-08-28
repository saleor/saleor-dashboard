import React from "react";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import { getMutationState, maybe } from "../../misc";
import PluginsDetailsPage from "../components/PluginsDetailsPage";
import { TypedPluginUpdate } from "../mutations";
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
    <TypedPluginUpdate>
      {(pluginUpdate, pluginUpdateOpts) => (
        <TypedPluginsDetailsQuery variables={{ id }}>
          {PluginDetails => {
            const formTransitionState = getMutationState(
              pluginUpdateOpts.called,
              pluginUpdateOpts.loading,
              maybe(() => pluginUpdateOpts.data.pluginUpdate.errors)
            );

            return (
              <>
                <WindowTitle
                  title={maybe(() => PluginDetails.data.plugin.name)}
                />
                <PluginsDetailsPage
                  disabled={PluginDetails.loading}
                  errors={maybe(
                    () => pluginUpdateOpts.data.pluginUpdate.errors,
                    []
                  )}
                  saveButtonBarState={formTransitionState}
                  plugin={maybe(() => PluginDetails.data.plugin)}
                  onBack={() => navigate(pluginsListUrl())}
                  onSubmit={formData => {
                    const configurationInput = [];
                    formData.configuration.map(item => {
                      configurationInput.push({
                        name: item.name,
                        value: item.value.toString()
                      });
                    });
                    pluginUpdate({
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
    </TypedPluginUpdate>
  );
};
PluginsDetails.displayName = "PluginsDetails";
export default PluginsDetails;
