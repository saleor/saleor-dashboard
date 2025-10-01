// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import {
  ConfigurationItemFragment,
  PluginConfigurationExtendedFragment,
  PluginErrorFragment,
  PluginsDetailsFragment,
} from "@dashboard/graphql";
import { ChangeEvent, SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { isSecretField } from "../utils";
import { PluginAuthorization } from "./PluginAuthorization";
import { PluginDetailsChannelsCard } from "./PluginDetailsChannelsCard";
import { PluginInfo } from "./PluginInfo";
import { PluginSettings } from "./PluginSettings/PluginSettings";

export interface PluginDetailsPageFormData {
  active: boolean;
  configuration: ConfigurationItemFragment[];
}

interface PluginsDetailsPageProps {
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

export const PluginsDetailsPage = ({
  disabled,
  errors,
  plugin,
  saveButtonBarState,
  onClear,
  onEdit,
  onSubmit,
  selectedConfig,
  setSelectedChannelId,
}: PluginsDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const initialFormData: PluginDetailsPageFormData = {
    active: selectedConfig?.active,
    configuration: selectedConfig?.configuration
      ?.filter(field => !isSecretField(selectedConfig?.configuration || [], field.name))
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
          <DetailPageLayout gridTemplateColumns={1} testId="plugin-details">
            <TopNav
              href={ExtensionsUrls.resolveInstalledExtensionsUrl()}
              title={intl.formatMessage(
                {
                  id: "ak62Oe",
                  defaultMessage: "{pluginName} details",
                  description: "plugin details page header",
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
                <Box paddingBottom={2}>
                  <PluginInfo
                    data={data}
                    description={plugin?.description || ""}
                    errors={errors}
                    name={plugin?.name || ""}
                    onChange={onChange}
                    disabled={disabled}
                  />
                  <Box marginTop={{ mobile: 2, desktop: 4 }} />
                  {data.configuration && (
                    <div>
                      <PluginSettings
                        data={data}
                        errors={errors}
                        disabled={disabled}
                        onChange={onChange}
                      />
                      {selectedConfig?.configuration.some(field =>
                        isSecretField(selectedConfig?.configuration, field.name),
                      ) && (
                        <PluginAuthorization
                          fields={selectedConfig.configuration}
                          onClear={onClear}
                          onEdit={onEdit}
                        />
                      )}
                    </div>
                  )}
                </Box>
              </Grid>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton
                  onClick={() => navigate(ExtensionsUrls.resolveInstalledExtensionsUrl())}
                />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={isSaveDisabled}
                />
              </Savebar>
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
