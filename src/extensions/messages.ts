import { AppErrorCode, AppErrorFragment } from "@dashboard/graphql";
import { getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const headerTitles = defineMessages({
  exploreExtensions: {
    defaultMessage: "Explore Extensions",
    id: "GUcbBE",
  },
  installedExtensions: {
    defaultMessage: "Installed Extensions",
    id: "C3sTzL",
  },
  addCustomExtensionManifest: {
    defaultMessage: "Add Custom Extension from manifest",
    id: "2+v6qd",
  },
});

export const buttonLabels = defineMessages({
  requestExtension: {
    defaultMessage: "Request Extension",
    id: "fOXF9A",
  },
  installFromManifest: {
    defaultMessage: "Install from manifest",
    id: "+G2N98",
  },
  installManually: {
    defaultMessage: "Provide details manually",
    id: "+pGERa",
  },
  addCustomExtensions: {
    defaultMessage: "Add Custom Extensions",
    id: "u9WrRb",
  },
  viewDetails: {
    defaultMessage: "View details",
    id: "MnpUD7",
  },
  manage: {
    defaultMessage: "Manage",
    id: "0Azlrb",
  },
  retry: {
    defaultMessage: "Retry",
    id: "62nsdy",
  },
});

export const infoMessages = defineMessages({
  appDisabled: {
    defaultMessage: "App disabled. Activate the app from the settings.",
    id: "r9R4OC",
  },
  installationFailed: {
    defaultMessage: "Installation failed",
    id: "9DUknc",
  },
  installationPending: {
    defaultMessage: "Installation is pending...",
    id: "KTjTMW",
  },
  webhookErrorDetected: {
    defaultMessage: "Webhook errors detected.",
    id: "CKP9+i",
  },
  webhookErrorLastSeen: {
    defaultMessage: "Last seen {date}.",
    id: "b1lW6g",
  },
  webhookErrorViewDetails: {
    defaultMessage: "See logs",
    id: "qkUBLC",
  },
});

export const messages = defineMessages({
  searchPlaceholder: {
    defaultMessage: "Search extensions...",
    id: "D66hpd",
  },
  installed: {
    defaultMessage: "Installed",
    id: "V22724",
  },
  developedBy: {
    defaultMessage: "Developed by {developer}",
    id: "xKLf5H",
  },
  community: {
    defaultMessage: "Community",
    id: "4CrCbD",
  },
  customBuild: {
    defaultMessage: "Custom build",
    id: "LdzrxA",
  },
  install: {
    defaultMessage: "Install",
    id: "ubmFc8",
  },
  viewDetails: {
    defaultMessage: "View details",
    id: "MnpUD7",
  },
  manageApp: {
    defaultMessage: "Manage app",
    id: "wZFsmY",
  },
  viewOnGithub: {
    defaultMessage: "View on GitHub",
    id: "80g19N",
  },
  pluginDescription: {
    defaultMessage: "Plugin built-in to Saleor’s core codebase",
    id: "JaLLdQ",
  },
  pluginInfoImportant: {
    defaultMessage: "Important",
    id: "+fICx5",
  },
  pluginInfo: {
    defaultMessage:
      "We are working on replacing plugins with apps. Use apps unless no other option. {learnMore}",
    id: "K58C4r",
  },
  learnMore: {
    defaultMessage: "Learn more",
    id: "TdTXXf",
  },
  emptyExtensionsApiUrl: {
    defaultMessage: "No extensions API URL provided",
    id: "gZ1qnD",
  },
  noExtensionsInstalled: {
    defaultMessage: "No Extensions installed yet",
    id: "2nT0Sm",
  },
  exploreAvailableExtensions: {
    defaultMessage: "Explore available Extensions",
    id: "MhT1CS",
  },
  noExtensionsFound: {
    defaultMessage: "No Extensions found",
    id: "jWLXdD",
  },
  clearSearch: {
    defaultMessage: "Clear search",
    id: "4YJHut",
  },
  installationCloudOnly: {
    defaultMessage: "Use Saleor Cloud to access Saleor Apps",
    description: "description",
    id: "IEpmGQ",
  },
  missingExtensionsButton: {
    id: "VS0YOp",
    defaultMessage: "Request Extension",
    description: "Request extension",
  },
  extensionName: {
    defaultMessage: "Extension Name",
    description: "Installed extensions column name",
    id: "7jxSx8",
  },
  learnMoreSubheader: {
    defaultMessage: "Learn more about {manifestFormatLink}",
    id: "0DTk+2",
    description: "Add custom extension page subheader",
  },
  manifestFormatLink: {
    defaultMessage: "manifest format",
    id: "sXSde1",
    description: "link to docs in add custom extensions page subheader",
  },
  installExtensionNameHeader: {
    defaultMessage: "You are about to install {extensionName}",
    id: "CB7xpk",
    description: "subheader on extension install page",
  },
  permissions: {
    defaultMessage: "Permissions",
    id: "7eGvyy",
    description: "extension install page, extension permissions (from manifest)",
  },
  permissionsExplanation: {
    defaultMessage: "Installing this app will give it following permissions",
    id: "O4R3Ni",
    description: "extension install page, permissions section",
  },
  infoCardTitle: {
    defaultMessage: "Info",
    id: "vGfmv8",
    description: "card title, app install page, about privacy",
  },
  infoCardText: {
    defaultMessage:
      "Uninstalling the app will remove all your customer’s personal data stored by {extensionName}. {learnMoreLink}",
    id: "chJmBW",
    description: "card text, app install page",
  },
  infoCardLearnMoreLink: {
    defaultMessage: "Learn more about data privacy.",
    id: "4KRhwm",
    description: "link in infoCardText, to Saleor docs",
  },
});

export const appManifestErrorMessages = defineMessages({
  invalidManifestFormat: {
    id: "pC6/1z",
    defaultMessage: "Invalid manifest format",
  },
  invalidPermission: {
    id: "D2qihU",
    defaultMessage: "Permission is invalid",
  },
  invalidStatus: {
    id: "v3WWK+",
    defaultMessage: "Status is invalid",
  },
  invalidUrlFormat: {
    id: "g/BrOt",
    defaultMessage: "Url has invalid format",
  },
  outOfScopeApp: {
    id: "C4hCsD",
    defaultMessage: "App is out of your permissions scope",
  },
  outOfScopeGroup: {
    id: "1n1tOR",
    defaultMessage: "Group is out of your permission scope",
  },
  outOfScopePermission: {
    id: "4prRLv",
    defaultMessage: "Permission is out of your scope",
  },
  unique: {
    id: "TDhHMi",
    defaultMessage: "This needs to be unique",
  },
});

export function getAppInstallErrorMessage(
  err: AppErrorFragment,
  intl: IntlShape,
): string | undefined {
  if (err) {
    switch (err.code) {
      case AppErrorCode.INVALID_MANIFEST_FORMAT:
        return intl.formatMessage(appManifestErrorMessages.invalidManifestFormat);
      case AppErrorCode.OUT_OF_SCOPE_APP:
        return intl.formatMessage(appManifestErrorMessages.outOfScopeApp);
      case AppErrorCode.OUT_OF_SCOPE_PERMISSION:
        return intl.formatMessage(appManifestErrorMessages.outOfScopePermission);
      case AppErrorCode.INVALID_PERMISSION:
        return intl.formatMessage(appManifestErrorMessages.invalidPermission);
      case AppErrorCode.INVALID_STATUS:
        return intl.formatMessage(appManifestErrorMessages.invalidStatus);
      case AppErrorCode.INVALID_URL_FORMAT:
        return intl.formatMessage(appManifestErrorMessages.invalidUrlFormat);
      case AppErrorCode.UNIQUE:
        return intl.formatMessage(appManifestErrorMessages.unique);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}
