import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  ConfigurationItemInput,
  PluginConfigurationExtendedFragment,
  PluginErrorFragment,
  PluginsDetailsFragment,
} from "@dashboard/graphql";
import { ChangeEvent, SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { pluginListUrl } from "@dashboard/plugins/urls";
import { isSecretField } from "@dashboard/plugins/utils";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import PluginAuthorization from "../PluginAuthorization";
import PluginDetailsChannelsCard from "../PluginDetailsChannelsCard";
import PluginInfo from "../PluginInfo";
import PluginSettings from "../PluginSettings";

export interface PluginDetailsPageFormData {
  active: boolean;
  configuration: ConfigurationItemInput[];
}

export interface PluginsDetailsPageProps {
  disabled: boolean;
  errors: PluginErrorFragment[];
  plugin?: PluginsDetailsFragment;
  saveButtonBarState: ConfirmButtonTransitionState;
  onClear: (field: string) => void;
  onEdit: (field: string) => void;
  onSubmit: (data: PluginDetailsPageFormData) => SubmitPromise;
  selectedConfig?: PluginConfigurationExtendedFragment;
  setSelectedChannelId: (channelId: string) => void;
}

const PluginsDetailsPage: React.FC<PluginsDetailsPageProps> = ({
  disabled,
  errors,
  plugin,
  saveButtonBarState,
  onClear,
  onEdit,
  onSubmit,
  selectedConfig,
  setSelectedChannelId,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialFormData: PluginDetailsPageFormData = {
    active: selectedConfig?.active,
    configuration: selectedConfig?.configuration
      ?.filter(
        field =>
          !isSecretField(selectedConfig?.configuration || [], field.name),
      )
      .map(field => ({
        ...field,
        value: field.value || "",
      })),
  };

  const selectedChannelId = selectedConfig?.channel?.id;

  return (
    <Form
      confirmLeave
      initial={initialFormData}
      onSubmit={onSubmit}
      key={selectedChannelId}
      disabled={disabled}
    >
      {({ data, submit, set, isSaveDisabled }) => {
        const onChange = (event: ChangeEvent) => {
          const { name, value } = event.target;
          const newData = {
            active: name === "active" ? value : data.active,
            configuration: data.configuration.map(configItem =>
              configItem.name === name
                ? {
                    ...configItem,
                    value,
                  }
                : configItem,
            ),
          };

          set(newData);
        };
        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav
              href={pluginListUrl()}
              title={intl.formatMessage(
                {
                  id: "EtGDeK",
                  defaultMessage: "{pluginName} Details",
                  description: "header",
                },
                {
                  pluginName: getStringOrPlaceholder(plugin?.name),
                },
              )}
            />
            <DetailPageLayout.Content>
              <Grid variant="inverted">
                <div>
                  <PluginDetailsChannelsCard
                    plugin={plugin}
                    selectedChannelId={selectedChannelId}
                    setSelectedChannelId={setSelectedChannelId}
                  />
                </div>
                <div>
                  <PluginInfo
                    data={data}
                    description={plugin?.description || ""}
                    errors={errors}
                    name={plugin?.name || ""}
                    onChange={onChange}
                  />
                  <CardSpacer />
                  {data.configuration && (
                    <div>
                      <PluginSettings
                        data={data}
                        fields={selectedConfig?.configuration || []}
                        errors={errors}
                        disabled={disabled}
                        onChange={onChange}
                      />
                      {selectedConfig?.configuration.some(field =>
                        isSecretField(
                          selectedConfig?.configuration,
                          field.name,
                        ),
                      ) && (
                        <>
                          <CardSpacer />
                          <PluginAuthorization
                            fields={selectedConfig.configuration}
                            onClear={onClear}
                            onEdit={onEdit}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Grid>
              <Savebar
                disabled={isSaveDisabled}
                state={saveButtonBarState}
                onCancel={() => navigate(pluginListUrl())}
                onSubmit={submit}
              />
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

export default PluginsDetailsPage;
