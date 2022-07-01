import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  ConfigurationItemInput,
  PluginConfigurationExtendedFragment,
  PluginErrorFragment,
  PluginsDetailsFragment,
} from "@saleor/graphql";
import { ChangeEvent, SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import { pluginListUrl } from "@saleor/plugins/urls";
import { isSecretField } from "@saleor/plugins/utils";
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
          <Container>
            <Backlink href={pluginListUrl()}>
              {intl.formatMessage(sectionNames.plugins)}
            </Backlink>
            <PageHeader
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
                      isSecretField(selectedConfig?.configuration, field.name),
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
          </Container>
        );
      }}
    </Form>
  );
};

export default PluginsDetailsPage;
