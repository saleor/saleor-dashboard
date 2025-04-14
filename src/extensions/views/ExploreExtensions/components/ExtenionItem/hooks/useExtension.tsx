import { messages } from "@dashboard/extensions/messages";
import { ExtensionData } from "@dashboard/extensions/types";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AppActions } from "../components/AppActions";
import { PluginActions } from "../components/PluginActions";

const saleor = "Saleor Commerce";

export const useExtension = (extension: ExtensionData) => {
  const intl = useIntl();
  const { theme } = useTheme();

  const getExtensionAvatar = () => {
    const source =
      theme === "defaultDark" ? extension.logo?.dark?.source : extension.logo?.light?.source;

    return <Box as="img" display="block" maxWidth="100%" src={source} />;
  };

  const getExtensionDescription = () => {
    if (extension.type === "PLUGIN") {
      return extension.description?.en ?? intl.formatMessage(messages.pluginDescription);
    }

    return extension.description?.en ?? "";
  };

  const getExtensionActions = () => {
    if (extension.type === "PLUGIN") {
      return <PluginActions id={extension.id} isInstalled={extension.installed ?? false} />;
    }

    return (
      <AppActions
        isInstalled={extension.installed || false}
        manifestUrl={extension.manifestUrl}
        repositoryUrl={extension.repositoryUrl}
        id={extension.appId}
        disabled={extension.disabled}
      />
    );
  };

  const getExtensionSubtitle = () => {
    if (extension.type === "APP") {
      if (extension.kind === "OSS") {
        return intl.formatMessage(messages.developedBy, {
          developer: intl.formatMessage(messages.community),
        });
      }

      if (extension.kind === "OFFICIAL") {
        if (extension.isCustomApp) {
          return intl.formatMessage(messages.customBuild);
        }

        return intl.formatMessage(messages.developedBy, {
          developer: saleor,
        });
      }
    }

    return intl.formatMessage(messages.developedBy, {
      developer: saleor,
    });
  };

  return {
    type: extension.type,
    title: extension.name.en,
    subtitle: getExtensionSubtitle(),
    description: getExtensionDescription(),
    avatar: getExtensionAvatar(),
    actions: getExtensionActions(),
    isInstalled: extension.installed,
  };
};
