import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  ConfigurationItemFragment,
  ConfigurationItemInput,
  usePluginQuery,
  usePluginUpdateMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PluginsDetailsPage, {
  PluginDetailsPageFormData,
} from "../components/PluginsDetailsPage";
import PluginSecretFieldDialog from "../components/PluginSecretFieldDialog";
import { pluginUrl, PluginUrlDialog, PluginUrlQueryParams } from "../urls";
import { isSecretField } from "../utils";
import { getConfigByChannelId, isPluginGlobal } from "./utils";

export interface PluginsDetailsProps {
  id: string;
  params: PluginUrlQueryParams;
}

export function getConfigurationInput(
  config: ConfigurationItemFragment[] | null,
  input: ConfigurationItemInput[] | null,
): ConfigurationItemInput[] | null {
  if (config === null || input === null) {
    return null;
  }

  return input
    .filter(field => !isSecretField(config, field.name))
    .map(field => ({
      name: field.name,
      value: field.value.toString(),
    }));
}

export const PluginsDetails: React.FC<PluginsDetailsProps> = ({
  id,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data: pluginData, loading } = usePluginQuery({
    displayLoader: true,
    variables: { id },
  });

  const plugin = pluginData?.plugin;

  const initialSelectedChannelValue =
    plugin && !isPluginGlobal(plugin.globalConfiguration)
      ? plugin.channelConfigurations[0].channel.id
      : null;

  const [selectedChannelId, setSelectedChannelId] = useStateFromProps(
    initialSelectedChannelValue,
  );

  const selectedConfig = isPluginGlobal(plugin?.globalConfiguration)
    ? plugin?.globalConfiguration
    : plugin?.channelConfigurations.find(
        getConfigByChannelId(selectedChannelId),
      );

  const [openModal, closeModal] = createDialogActionHandlers<
    PluginUrlDialog,
    PluginUrlQueryParams
  >(navigate, params => pluginUrl(id, params), params);

  const [pluginUpdate, pluginUpdateOpts] = usePluginUpdateMutation({
    onCompleted: data => {
      if (data.pluginUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        closeModal();
      }
    },
  });

  const formErrors = pluginUpdateOpts.data?.pluginUpdate.errors || [];

  const handleFieldUpdate = (value: string) =>
    pluginUpdate({
      variables: {
        channelId: selectedChannelId,
        id,
        input: {
          configuration: [
            {
              name: params.id,
              value,
            },
          ],
        },
      },
    });

  const handleSubmit = async (formData: PluginDetailsPageFormData) =>
    extractMutationErrors(
      pluginUpdate({
        variables: {
          channelId: selectedChannelId,
          id,
          input: {
            active: formData.active,
            configuration: getConfigurationInput(
              selectedConfig?.configuration,
              formData.configuration,
            ),
          },
        },
      }),
    );

  return (
    <>
      <WindowTitle title={plugin?.name} />
      <PluginsDetailsPage
        disabled={loading}
        errors={formErrors}
        saveButtonBarState={
          !params.action ? pluginUpdateOpts.status : "default"
        }
        plugin={plugin}
        onClear={id =>
          openModal("clear", {
            id,
          })
        }
        onEdit={id =>
          openModal("edit", {
            id,
          })
        }
        onSubmit={handleSubmit}
        selectedConfig={selectedConfig}
        setSelectedChannelId={setSelectedChannelId}
      />
      {selectedConfig && (
        <>
          <ActionDialog
            confirmButtonState={
              !!params.action ? pluginUpdateOpts.status : "default"
            }
            onClose={closeModal}
            open={params.action === "clear" && !!params.id}
            title={intl.formatMessage({
              id: "N6lfS/",
              defaultMessage: "Authorization Field Delete",
              description: "header",
            })}
            onConfirm={() => handleFieldUpdate(null)}
          >
            <DialogContentText>
              <FormattedMessage
                id="JRfJD9"
                defaultMessage="The plugin may stop working after this field is cleared. Are you sure you want to proceed?"
              />
            </DialogContentText>
          </ActionDialog>
          <PluginSecretFieldDialog
            confirmButtonState={
              !!params.action ? pluginUpdateOpts.status : "default"
            }
            field={selectedConfig?.configuration.find(
              field => field.name === params.id,
            )}
            onClose={closeModal}
            onConfirm={formData => handleFieldUpdate(formData.value)}
            open={params.action === "edit" && !!params.id}
          />
        </>
      )}
    </>
  );
};
PluginsDetails.displayName = "PluginsDetails";
export default PluginsDetails;
