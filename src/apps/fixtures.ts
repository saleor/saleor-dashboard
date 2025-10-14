import { AppAvatarFragment, AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";

import { AppstoreApi } from "./appstore.types";

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
          source: "https://www.released-example.com/images/first-integration-logo-light.png",
        },
        dark: {
          source: "https://www.released-example.com/images/first-integration-logo-dark.png",
        },
      },
    },
    {
      name: "Second released integration",
      logo: {
        light: {
          source: "https://www.released-example.com/images/second-integration-logo-light.png",
        },
        dark: {
          source: "https://www.released-example.com/images/second-integration-logo-dark.png",
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
          source: "https://www.coming-soon-example.com/images/first-integration-logo-light.png",
        },
        dark: {
          source: "https://www.coming-soon-example.com/images/first-integration-logo-dark.png",
        },
      },
    },
    {
      name: "Second coming soon integration",
      logo: {
        light: {
          source: "https://www.coming-soon-example.com/images/second-integration-logo-light.png",
        },
        dark: {
          source: "https://www.coming-soon-example.com/images/second-integration-logo-dark.png",
        },
      },
    },
  ],
};
