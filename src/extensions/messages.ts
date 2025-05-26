import { defineMessages } from "react-intl";

const DOCS_MANIFEST_COMMON_ERRORS_URL =
  "https://docs.saleor.io/docs/next/developer/extending/apps/manifest";

// Placeholder for specific error documentation links
// For now, all errors point to the same general manifest errors page.
// TODO: Update with specific URLs once available.
export const getSpecificManifestErrorDocLink = (_errorCode?: string): string => {
  // We'll add this when we add page with specific error code messages
  // if (errorCode === "INVALID_PERMISSION") {
  //   return "https://docs.saleor.io/docs/next/developer/extending/apps/manifest#invalid-permission";
  // }
  return DOCS_MANIFEST_COMMON_ERRORS_URL;
};

export const headerTitles = defineMessages({
  exploreExtensions: {
    defaultMessage: "Explore",
    description: "page title",
    id: "32Capp",
  },
  installedExtensions: {
    defaultMessage: "All installed",
    description: "page title",
    id: "VQvNZx",
  },
  addCustomExtension: {
    defaultMessage: "Add Custom Extension manually",
    description: "page title - creating custom app",

    id: "RkhreQ",
  },
  addCustomExtensionManifest: {
    defaultMessage: "Add Custom Extension from manifest",
    description: "page title - installing app with manifestUrl form",
    id: "RKxceS",
  },
  addCustomExtensionManifestUrl: {
    defaultMessage: "Add Extension",
    description: "page title - installing app with manifestUrl provided",
    id: "wSS9YI",
  },
  extensions: {
    defaultMessage: "Extensions",
    description: "page title - extensions",
    id: "WD+kjr",
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
  explore: {
    defaultMessage: "Explore",
    id: "7JlauX",
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
  save: {
    defaultMessage: "Save",
    id: "jvo0vs",
  },
  remove: {
    defaultMessage: "Remove",
    id: "G/yZLu",
  },
  back: {
    defaultMessage: "Back",
    id: "cyR7Kh",
  },
  addExtension: {
    defaultMessage: "Add Extension",
    id: "52lmfF",
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
  permissionsDescription: {
    defaultMessage: "Expand or restrict app permissions to access certain part of Saleor system.",
    id: "HwlLvq",
  },
  grantFullAccess: {
    defaultMessage: "Grant this app full access to the store",
    id: "VtR2/y",
  },
});

export const formLabels = defineMessages({
  appName: {
    defaultMessage: "App Name",
    id: "kExPDx",
    description: "extension form app name field label",
  },
  appNamePlaceholder: {
    defaultMessage: "App Name",
    id: "JKoHqo",
    description: "extension form app name field placeholder",
  },
  permissions: {
    defaultMessage: "Permissions",
    id: "PHT8z1",
    description: "extension form permissions section header",
  },
});

export const notifyMessages = defineMessages({
  extensionReadyToUse: {
    defaultMessage: "{name} is ready to be used",
    id: "qRmntJ",
    description: "extensions list ready to be used",
  },
  extensionInstalled: {
    defaultMessage: "Extension installed",
    description: "extensions list has been installed",
    id: "43b+ts",
  },
  extensionRemoved: {
    defaultMessage: "Extension successfully removed",
    description: "extensions list has been removed",
    id: "EGzGed",
  },
  extensionInstallError: {
    id: "TPJeJF",
    defaultMessage: "Couldn't Install {name}",
    description: "extensions list has not been installed",
  },
});

export const messages = defineMessages({
  searchPlaceholder: {
    defaultMessage: "Search Extensions...",
    id: "qMEm+l",
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
    defaultMessage: "Plugin built-in to Saleor's core codebase",
    id: "EEWsPs",
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
      "Uninstalling the app will remove all your customer's personal data stored by {extensionName}. {learnMoreLink}",
    id: "3fZa8B",
    description: "card text, app install page",
  },
  infoCardLearnMoreLink: {
    defaultMessage: "Learn more about data privacy.",
    id: "4KRhwm",
    description: "link in infoCardText, to Saleor docs",
  },
  manifestUrlLabel: {
    defaultMessage: "Provide Manifest URL",
    id: "mZrAiu",
    description: "extension installation page, label for manifest URL input",
  },
  deleteFailedInstallation: {
    defaultMessage: "Remove failed installation",
    id: "jDWPin",
    description: "remove failed installation dialog title",
  },
  deleteFailedInstallationContent: {
    id: "Uh3NX/",
    defaultMessage: "Are you sure you want to delete {name} failed installation?",
    description: "remove failed installation dialog content",
  },
  learnMoreCustomExtensions: {
    defaultMessage: "Learn more about {customExtensionDocsLink}",
    id: "9Fiuq2",
  },
  learnMoreCustomExtensionsLinkText: {
    defaultMessage: "creating custom extensions",
    id: "GIuS7b",
  },
  customExtensionPermissionWarning: {
    defaultMessage:
      "Unavailable permissions are those exceeding your own access rights. Apps cannot have more permissions than their creator. Please contact an administrator to either create this app for you or grant your account the necessary permissions",
    description: "custom extension page create, callout message",
    id: "ssI7EL",
  },
  missingAppNameError: {
    defaultMessage: "App name is required",
    description: "custom extension page create, error message",
    id: "nLCEQJ",
  },
  permissionDisabledTooltip: {
    defaultMessage: "Permission cannot be chosen, because you don't have it yourself",
    description: "custom extension page create, tooltip",
    id: "a2o5uc",
  },
});

export const appManifestErrorMessages = defineMessages({
  invalidManifest: {
    // AppErrorCode.INVALID
    id: "ZXOpCJ",
    defaultMessage:
      "An unexpected issue occurred when parsing manifest. Please contact support. ({errorCode})",
  },
  invalidPermission: {
    // AppErrorCode.INVALID_PERMISSION
    id: "DRaREj",
    defaultMessage:
      "The extension's manifest requests invalid or unrecognized permissions. {docsLink} ({errorCode})",
  },
  invalidUrlFormat: {
    // AppErrorCode.INVALID_URL_FORMAT
    id: "FXtMVc",
    defaultMessage:
      "A URL field within the extension's manifest has an invalid format. {docsLink} ({errorCode})",
  },
  invalidUrlFormatSimple: {
    // AppErrorCode.INVALID_URL_FORMAT
    id: "+vzDH4",
    defaultMessage: "Invalid manifest URL",
    description:
      "error message used when manifest URL is incorrect (before any further validation)",
  },
  invalidManifestFormat: {
    // AppErrorCode.INVALID_MANIFEST_FORMAT
    defaultMessage: "The extension's manifest has an invalid format. {docsLink} ({errorCode})",
    id: "FuIgAe",
  },
  invalidCustomHeaders: {
    // AppErrorCode.INVALID_CUSTOM_HEADERS
    defaultMessage:
      "The 'customHeaders' field for a webhook in the extension's manifest is invalid. {docsLink} ({errorCode})",
    id: "CPPACf",
  },
  invalidManifestUrlCannotConnect: {
    // AppErrorCode.MANIFEST_URL_CANT_CONNECT
    defaultMessage:
      // TODO: Add docs link when we have docs page with explanation
      "Saleor could not connect to the provided manifest URL. ({errorCode})",
    id: "DbNXK5",
  },
  notFound: {
    // AppErrorCode.NOT_FOUND
    // TODO: Add docs link when we have docs page with explanation
    defaultMessage: "The extension manifest was not found. ({errorCode})",
    id: "eY+BKQ",
  },
  outOfScopeApp: {
    // AppErrorCode.OUT_OF_SCOPE_APP
    id: "/84FbR",
    // TODO: Add docs link when we have docs page with explanation
    defaultMessage:
      "You don't have permission to manage this app. Please contact your administrator for assistance. ({errorCode})",
  },
  outOfScopePermission: {
    // AppErrorCode.OUT_OF_SCOPE_PERMISSION
    id: "IG+/HP",
    defaultMessage:
      "The app requests permissions you cannot grant or that exceed its allowed scope. Review the app manifest and your permissions. {docsLink} ({errorCode})",
  },
  unique: {
    // AppErrorCode.UNIQUE
    id: "MS86iy",
    // TODO: Add docs link when we have docs page with explanation
    defaultMessage: "The extension identifier is already in use. ({errorCode})",
  },
  forbidden: {
    // AppErrorCode.FORBIDDEN
    defaultMessage: "You are not allowed to perform this action. ({errorCode})",
    id: "B0XvpR",
  },
  genericError: {
    // AppErrorCode.INVALID
    defaultMessage: "An unexpected error occurred. ({errorCode})",
    id: "qACBaj",
  },
  invalidStatus: {
    // AppErrorCode.INVALID_STATUS
    id: "tLM9Jr",
    defaultMessage:
      "The operation cannot be performed right now. This might be due to a pending installation with the same identifier. {docsLink} ({errorCode})",
  },
  required: {
    // AppErrorCode.REQUIRED
    id: "aXytBR",
    defaultMessage:
      "A required field is missing in the extension's manifest. {docsLink} ({errorCode})",
  },
  graphqlError: {
    // AppErrorCode.GRAPHQL_ERROR
    id: "q5I8Ac",
    defaultMessage: "An unexpected GraphQL error occurred. ({errorCode})",
  },
  unsupportedSaleorVersion: {
    // AppErrorCode.UNSUPPORTED_SALEOR_VERSION
    id: "fWaj1M",
    defaultMessage:
      "The Saleor version your extension is trying to use is newer than your current Saleor version. {docsLink} ({errorCode})",
  },
});

export const appMessages = defineMessages({
  failedToFetchAppSettings: {
    id: "ac+Y98",
    defaultMessage: "Failed to fetch app settings",
    description: "app settings error",
  },
  appActivated: {
    id: "D/+84n",
    defaultMessage: "App activated",
    description: "snackbar text",
  },
  appDeactivated: {
    id: "USO8PB",
    defaultMessage: "App deactivated",
    description: "snackbar text",
  },
  missingManageAppsPermission: {
    defaultMessage: "You don't have permission to manage apps",
    id: "e5gJ9u",
    description: "tooltip for disabled buttons",
  },
});
