import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import i18n from "@saleor/i18n";
import React from "react";
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
  const notify = useNotifier();

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
                  text: i18n.t("Succesfully updated plugin settings")
                });
              }
            }

            return (
              <>
                <WindowTitle
                  title={maybe(() => PluginDetails.data.plugin.name)}
                />
                <PluginsDetailsPage
                  disabled={PluginDetails.loading}
                  errors={formErrors}
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
