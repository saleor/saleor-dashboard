import {
  AppListItemFragment,
  AppManifestFragment,
  AppsInstallationsQuery,
  AppTypeEnum,
  JobStatusEnum,
  PermissionEnum,
} from "@saleor/graphql";

import { GetV2SaleorAppsResponse } from "./marketplace.types";

export const activeApp: AppListItemFragment = {
  __typename: "App",
  id: "QXBwOjE3Ng==",
  isActive: true,
  name: "First App",
  type: AppTypeEnum.THIRDPARTY,
  version: "1.0.0",
  appUrl: "http://localhost:3000",
  manifestUrl: "http://localhost:3000/api/manifest",
  permissions: [
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage customers.",
    },
  ],
};

export const inactiveApp: AppListItemFragment = {
  __typename: "App",
  id: "QXBwOj4TMb==",
  isActive: false,
  name: "Second App",
  type: AppTypeEnum.THIRDPARTY,
  version: "1.0.0",
  appUrl: null,
  manifestUrl: "http://localhost:3000/api/manifest",
  permissions: [
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_ORDERS,
      name: "Manage orders.",
    },
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage customers.",
    },
  ],
};

export const installedAppsList: AppListItemFragment[] = [
  activeApp,
  inactiveApp,
];

export const appsInProgress: AppsInstallationsQuery["appsInstallations"] = [
  {
    __typename: "AppInstallation",
    appName: "app",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Failed to connect to app. Try later or contact with app support.",
    status: JobStatusEnum.FAILED,
  },
  {
    __typename: "AppInstallation",
    appName: "app pending",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Pending.",
    status: JobStatusEnum.PENDING,
  },
  {
    __typename: "AppInstallation",
    appName: "app success",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Success.",
    status: JobStatusEnum.SUCCESS,
  },
];

export const installApp: AppManifestFragment = {
  __typename: "Manifest",
  about: "Lorem ipsum",
  appUrl: null,
  configurationUrl: null,
  dataPrivacy: null,
  dataPrivacyUrl: null,
  homepageUrl: null,
  identifier: "app",
  name: "app",
  permissions: [
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage users",
    },
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_ORDERS,
      name: "Manage orders",
    },
  ],
  supportUrl: null,
  tokenTargetUrl: null,
  version: "1.0",
};

export const releasedApp: GetV2SaleorAppsResponse.ReleasedSaleorApp = {
  name: {
    en: "Test released app",
  },
  description: {
    en: "Test released app description",
  },
  logo: {
    source: "https://www.released-example.com/images/logo.png",
    color: "#000000",
  },
  manifestUrl: "https://www.released-example.com/manifest",
  privacyUrl: "https://www.released-example.com/privacy",
  supportUrl: "https://www.released-example.com/support",
  repositoryUrl: "https://www.released-example.com/repository",
  vercelDeploymentUrl: "https://www.released-example.com/deployment",
  integrations: [
    {
      name: "First released integration",
      logo: {
        light: {
          source:
            "https://www.released-example.com/images/first-integration-logo-light.png",
        },
        dark: {
          source:
            "https://www.released-example.com/images/first-integration-logo-dark.png",
        },
      },
    },
    {
      name: "Second released integration",
      logo: {
        light: {
          source:
            "https://www.released-example.com/images/second-integration-logo-light.png",
        },
        dark: {
          source:
            "https://www.released-example.com/images/second-integration-logo-dark.png",
        },
      },
    },
  ],
};

export const comingSoonApp: GetV2SaleorAppsResponse.ComingSoonSaleorApp = {
  name: {
    en: "Test coming soon app",
  },
  description: {
    en: "Test coming soon app description",
  },
  logo: {
    source: "https://www.coming-soon-example.com/images/logo.png",
    color: "#000000",
  },
  releaseDate: "2019-12-16",
  integrations: [
    {
      name: "First coming soon integration",
      logo: {
        light: {
          source:
            "https://www.coming-soon-example.com/images/first-integration-logo-light.png",
        },
        dark: {
          source:
            "https://www.coming-soon-example.com/images/first-integration-logo-dark.png",
        },
      },
    },
    {
      name: "Second coming soon integration",
      logo: {
        light: {
          source:
            "https://www.coming-soon-example.com/images/second-integration-logo-light.png",
        },
        dark: {
          source:
            "https://www.coming-soon-example.com/images/second-integration-logo-dark.png",
        },
      },
    },
  ],
};
