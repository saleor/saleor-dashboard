import PluginIcon from "@assets/images/plugin.svg";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { useIntl } from "react-intl";

import { messages } from "../../../messages";
import { ExtensionData } from "../../../types";
import { AppActions } from "../components/AppActions";
import { PluginActions } from "../components/PluginActions";

const saleor = "Saleor Commerce";

export const useExtension = (extension: ExtensionData, isInstalled = false) => {
  const intl = useIntl();

  const getExtensionAvatar = () => {
    if (extension.type === "PLUGIN") {
      return <SVG src={PluginIcon} />;
    }

    return <Box as="img" display="block" maxWidth="100%" src={extension.logo?.light} />;
  };

  const getExtensionDescription = () => {
    if (extension.type === "PLUGIN") {
      return extension.description?.en ?? intl.formatMessage(messages.pluginDescription);
    }

    return extension.description?.en ?? "";
  };

  const getExtensionActions = () => {
    if (extension.type === "PLUGIN") {
      return <PluginActions id={extension.id} isInstalled={isInstalled} />;
    }

    return (
      <AppActions
        isInstalled={isInstalled}
        manifestUrl={extension.manifestUrl}
        repositoryUrl={extension.repositoryUrl}
        id={extension.id}
      />
    );
  };

  const getExtensionSubtitle = () => {
    if (extension.type === "PLUGIN") {
      return intl.formatMessage(messages.developedBy, {
        developer: saleor,
      });
    }

    // Here extension.type is equal APP

    if (extension.kind === "OSS") {
      return intl.formatMessage(messages.developedBy, {
        developer: intl.formatMessage(messages.community),
      });
    }

    if (extension.kind === "OFFICIAL") {
      return intl.formatMessage(messages.developedBy, {
        developer: saleor,
      });
    }

    return intl.formatMessage(messages.customBuild);
  };

  return {
    type: extension.type,
    title: extension.name,
    subtitle: getExtensionSubtitle(),
    description: getExtensionDescription(),
    avatar: getExtensionAvatar(),
    actions: getExtensionActions(),
    isInstalled,
  };
};
