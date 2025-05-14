import { defineMessages } from "react-intl";

export const headerTitles = defineMessages({
  exploreExtensions: {
    defaultMessage: "Explore Extensions",
    id: "GUcbBE",
  },
  installedExtensions: {
    defaultMessage: "Installed Extensions",
    id: "C3sTzL",
  },
  addCustomExtension: {
    defaultMessage: "Add Custom Extension manually",
    id: "fHHHVV",
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
    id: "s4w6QI",
    defaultMessage:
      "The extension's manifest contains one or more fields with invalid values. Please check fields like extension 'target'/'mount' or webhook 'isActive' for correctness.",
  },
  invalidPermission: {
    id: "gGIYm5",
    defaultMessage:
      "The extensions's manifest requests permissions that are not valid or recognized by Saleor. Please check the 'permissions' list in the manifest.",
  },
  invalidUrlFormat: {
    id: "5g5FHH",
    defaultMessage:
      "A URL field within the extension's manifest (e.g., 'tokenTargetUrl', extension URL, or webhook URL) has an invalid format.",
  },
  invalidManifestFormat: {
    defaultMessage:
      "The extension's manifest has an invalid format. Please ensure it is well-formed (e.g., valid JSON, correct data structures).",
    id: "eDNOCM",
  },
  invalidCustomHeaders: {
    defaultMessage:
      "The 'customHeaders' field for a webhook in the extension's manifest is invalid. Please ensure it's a valid JSON object with correct header names and values.",
    id: "sOhgPN",
  },
  invalidManifestUrlCannotConnect: {
    defaultMessage:
      "Saleor could not connect to the provided manifest URL. Please check network connectivity, ensure the server is accessible, and the URL is correct.",
    id: "JOGr6i",
  },
  notFound: {
    defaultMessage: "The extension manifest was not found.",
    id: "59tdCU",
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
    id: "WDQJCi",
    defaultMessage:
      "Saleor cannot assign one or more permissions requested in your extension's manifest. This may be because your Saleor user account lacks the necessary privileges to grant them, or a component within your manifest's extensions array is requesting a permission not also declared in the manifest's main permissions list. Please verify your user account's privileges and ensure consistency in permission declarations throughout your ",
  },
  unique: {
    id: "2qfU+C",
    defaultMessage: "The extension identifier is already in use.",
  },
  forbidden: {
    defaultMessage: "You are not allowed to perform this action",
    id: "hz2Xpo",
  },
  genericError: {
    defaultMessage: "An unexpected error occurred, please try again later.",
    id: "jGOGaN",
  },
  invalidStatus: {
    id: "M1PPZT",
    defaultMessage:
      "The operation cannot be performed right now, check if app with the same identifier doesn't have already pending installation on the extensions list",
  },
  required: {
    id: "moJfQ4",
    defaultMessage:
      "A required field is missing in the extension's manifest. Please ensure all mandatory fields (e.g., 'id', 'version', 'name') are present.",
  },
  graphqlError: {
    id: "jGOGaN",
    defaultMessage: "An unexpected error occurred, please try again later.",
  },
  unsupportedSaleorVersion: {
    id: "bJiuIR",
    defaultMessage: "The saleor version that your extension is trying to use is not supported.",
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
