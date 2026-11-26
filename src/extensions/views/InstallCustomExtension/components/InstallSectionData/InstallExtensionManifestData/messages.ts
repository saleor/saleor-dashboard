import { defineMessages } from "react-intl";

export const manifestMessages = defineMessages({
  externalChip: {
    defaultMessage: "External app",
    id: "XZggY6",
    description: "badge on an app that is not hosted on the Saleor app domain",
  },
  officialChip: {
    defaultMessage: "Official Saleor app",
    id: "gwKrrn",
    description: "badge on an app whose every endpoint is on the Saleor app domain",
  },
  headerVersion: {
    defaultMessage: "v{version}",
    id: "aihRBP",
    description: "app version in the install header",
  },
  headerAuthor: {
    defaultMessage: "by {author}",
    id: "GHPwJu",
    description: "app author in the install header",
  },
  externalTitle: {
    defaultMessage: "External apps can be dangerous",
    id: "gBOIO2",
    description: "warning title on the install page for an app not hosted by Saleor",
  },
  externalDescription: {
    defaultMessage:
      "This app is not published by Saleor. It can copy the name and logo of a known vendor, but not its domain. Once installed, it gets an access token for your store and the access listed below.",
    id: "3/WV/P",
    description: "warning body on the install page for an app not hosted by Saleor",
  },
  externalAcknowledgement: {
    defaultMessage: "I trust {domains}",
    id: "2rOG8A",
    description: "checkbox required before installing an external app; domains is a list of hosts",
  },
  officialTitle: {
    defaultMessage: "Official Saleor app",
    id: "G/weiO",
    description: "info title on the install page for an official Saleor app",
  },
  officialDescription: {
    defaultMessage: "The manifest and every endpoint are hosted by Saleor.",
    id: "BCQwnf",
    description: "info body on the install page for an official Saleor app",
  },
  issuesTitle: {
    defaultMessage:
      "The manifest has {count, plural, one {# issue} other {# issues}}. The app can't be installed.",
    id: "Wt1+QW",
    description: "error title when the fetched app manifest fails validation",
  },
  navAriaLabel: {
    defaultMessage: "App manifest sections",
    id: "zL7WfX",
    description: "aria label of the section navigation on the install page",
  },
  overview: {
    defaultMessage: "Overview",
    id: "tH1Z76",
    description: "install page section title",
  },
  connections: {
    defaultMessage: "Connections",
    id: "200XWt",
    description: "install page section title: every URL the app is reached at",
  },
  connectionsSubtitle: {
    defaultMessage: "Where the app receives your store's data",
    id: "c5LrvQ",
    description: "install page connections section subtitle",
  },
  permissions: {
    defaultMessage: "Permissions",
    id: "Ugxzyw",
    description: "install page section title",
  },
  permissionsSubtitle: {
    defaultMessage: "What the app can read and change",
    id: "H6GK2f",
    description: "install page permissions section subtitle",
  },
  noPermissions: {
    defaultMessage: "This app doesn't request any permissions.",
    id: "hqzFSf",
    description: "install page permissions section, empty state",
  },
  sensitive: {
    defaultMessage: "Sensitive",
    id: "0uiR43",
    description: "badge on a permission that grants access to payments, staff or personal data",
  },
  extensions: {
    defaultMessage: "Extensions",
    id: "98hvB9",
    description: "install page connections sub-table header for Dashboard extensions",
  },
  webhooks: {
    defaultMessage: "Webhooks",
    id: "uRdxRu",
    description: "install page section title",
  },
  endpointManifest: {
    defaultMessage: "Manifest",
    id: "XtavJs",
    description: "install page connections row: the manifest URL",
  },
  endpointApp: {
    defaultMessage: "App URL",
    id: "H11aBC",
    description: "install page connections row: the app URL",
  },
  endpointTokenTarget: {
    defaultMessage: "Auth token target",
    id: "/Ex5HH",
    description: "install page connections row: URL that receives the app token",
  },
  endpointTokenTargetHint: {
    defaultMessage: "Receives your store's access token",
    id: "li/xmq",
    description: "install page connections row hint for the auth token target",
  },
  differentDomain: {
    defaultMessage: "Different domain",
    id: "mVcNuH",
    description: "badge on a domain that differs from the manifest's domain",
  },
  identifier: {
    defaultMessage: "Identifier",
    id: "Bhp8dq",
    description: "install page overview field",
  },
  manifestUrl: {
    defaultMessage: "Manifest URL",
    id: "W5ROsw",
    description: "install page overview field",
  },
  requiredSaleorVersion: {
    defaultMessage: "Required Saleor version",
    id: "NcsgOQ",
    description: "install page overview field",
  },
  versionNotSupported: {
    defaultMessage: "Not supported by this Saleor",
    id: "M8Ni/L",
    description: "badge when the store's Saleor version does not match the app's requirement",
  },
  links: {
    defaultMessage: "Links",
    id: "roSQMa",
    description: "install page overview field",
  },
  homepage: {
    defaultMessage: "Homepage",
    id: "zZuZ+4",
    description: "install page link to the app homepage",
  },
  support: {
    defaultMessage: "Support",
    id: "wpiMMk",
    description: "install page link to the app support page",
  },
  privacyPolicy: {
    defaultMessage: "Privacy policy",
    id: "NX6phB",
    description: "install page link to the app data privacy page",
  },
});
