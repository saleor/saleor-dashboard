import {
  AppAvatarFragment,
  AppInstallationFragment,
  AppListItemFragment,
  AppManifestFragment,
  AppQuery,
  AppTypeEnum,
  JobStatusEnum,
  PermissionEnum,
} from "@dashboard/graphql";

import { AppstoreApi } from "./appstore.types";

export const activeApp: AppListItemFragment = {
  __typename: "App",
  id: "QXBwOjE3Ng==",
  isActive: true,
  name: "First App",
  type: AppTypeEnum.THIRDPARTY,
  version: "1.0.0",
  appUrl: "http://localhost:3000",
  manifestUrl: "http://localhost:3000/api/manifest",
  created: "2020-06-02T12:24:26.818138+00:00",
  permissions: [
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage customers.",
    },
  ],
  brand: null,
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
  created: "2020-06-02T12:24:26.818138+00:00",
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
  brand: null,
};

export const installedAppsList: AppListItemFragment[] = [
  activeApp,
  inactiveApp,
];

export const failedAppInProgress: AppInstallationFragment = {
  __typename: "AppInstallation",
  appName: "app",
  id: "QXBwSW5zdGFsbGF0aW9uOjk2",
  manifestUrl: "https://www.released-example.com/manifest",
  message: "Failed to connect to app. Try later or contact with app support.",
  status: JobStatusEnum.FAILED,
  brand: null,
};

export const pendingAppInProgress: AppInstallationFragment = {
  __typename: "AppInstallation",
  appName: "app pending",
  id: "QXBwSW5zdGFsbGF0aW9uOjk2",
  manifestUrl: "https://www.released-example.com/manifest",
  message: "Pending.",
  status: JobStatusEnum.PENDING,
  brand: null,
};

export const successAppInProgress: AppInstallationFragment = {
  __typename: "AppInstallation",
  appName: "app success",
  id: "QXBwSW5zdGFsbGF0aW9uOjk2",
  manifestUrl: "https://www.released-example.com/manifest",
  message: "Success.",
  status: JobStatusEnum.SUCCESS,
  brand: null,
};

export const appsInProgress: AppInstallationFragment[] = [
  failedAppInProgress,
  pendingAppInProgress,
  successAppInProgress,
];

export const appDetails: NonNullable<AppQuery["app"]> = {
  __typename: "App",
  aboutApp: "Lorem ipsum",
  accessToken: "token",
  appUrl: "http://localhost:8888/app",
  manifestUrl: "http://localhost:8888/api/manifest",
  configurationUrl: "htpp://localhost:8888/configuration",
  created: "2020-06-02T12:24:26.818138+00:00",
  dataPrivacy: "Lorem ipsum",
  dataPrivacyUrl: "http://localhost:8888/app-data-privacy",
  homepageUrl: "http://localhost:8888/homepage",
  id: "QXBwOjE4MQ==",
  isActive: true,
  metadata: [],
  name: "app1",
  author: "Saleor Commerce",
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
  privateMetadata: [],
  supportUrl: "http://localhost:8888/support",
  tokens: [],
  type: AppTypeEnum.THIRDPARTY,
  version: "1.0.0",
  webhooks: [],
  brand: null,
};

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
  brand: null,
};

export const appAvatar: AppAvatarFragment = {
  id: "QXBwOjE3Ng==",
  name: "app",
  __typename: "App",
};

export const releasedApp: AppstoreApi.ReleasedSaleorApp = {
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
  githubForkUrl: "https://www.released-example.com/repository/fork",
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

export const comingSoonApp: AppstoreApi.ComingSoonSaleorApp = {
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
