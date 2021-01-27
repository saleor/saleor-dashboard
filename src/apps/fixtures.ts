import {
  AppTypeEnum,
  JobStatusEnum,
  PermissionEnum
} from "../types/globalTypes";
import { App_app } from "./types/App";
import { AppFetch_appFetchManifest_manifest } from "./types/AppFetch";
import { AppsInstallations_appsInstallations } from "./types/AppsInstallations";
import { AppsList_apps_edges } from "./types/AppsList";

export const appsList: AppsList_apps_edges[] = [
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      id: "QXBwOjE3Ng==",
      isActive: true,
      name: "app",
      type: AppTypeEnum.THIRDPARTY
    }
  },
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      id: "QXBwOjE3Ng==",
      isActive: false,
      name: "app1",
      type: AppTypeEnum.THIRDPARTY
    }
  }
];

export const customAppsList: AppsList_apps_edges[] = [
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      id: "QXBwOjE3Ng==",
      isActive: true,
      name: "app custom",
      type: AppTypeEnum.LOCAL
    }
  }
];

export const appsInProgress: AppsInstallations_appsInstallations[] = [
  {
    __typename: "AppInstallation",
    appName: "app",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Failed to connect to app. Try later or contact with app support.",
    status: JobStatusEnum.FAILED
  },
  {
    __typename: "AppInstallation",
    appName: "app pending",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Pending.",
    status: JobStatusEnum.PENDING
  },
  {
    __typename: "AppInstallation",
    appName: "app success",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Success.",
    status: JobStatusEnum.SUCCESS
  }
];

export const appDetails: App_app = {
  __typename: "App",
  aboutApp: "Lorem ipsum",
  accessToken: "token",
  appUrl: "http://localhost:8888/app",
  configurationUrl: "htpp://localhost:8888/configuration",
  created: "2020-06-02T12:24:26.818138+00:00",
  dataPrivacy: "Lorem ipsum",
  dataPrivacyUrl: "http://localhost:8888/app-data-privacy",
  homepageUrl: "http://localhost:8888/homepage",
  id: "QXBwOjE4MQ==",
  isActive: true,
  metadata: [],
  name: "app1",
  permissions: [
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_ORDERS,
      name: "Manage orders."
    },
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage customers."
    }
  ],
  privateMetadata: [],
  supportUrl: "http://localhost:8888/support",
  tokens: [],
  type: AppTypeEnum.THIRDPARTY,
  version: "1.0.0",
  webhooks: []
};

export const installApp: AppFetch_appFetchManifest_manifest = {
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
      name: "Manage users"
    },
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_ORDERS,
      name: "Manage orders"
    }
  ],
  supportUrl: null,
  tokenTargetUrl: null,
  version: "1.0"
};
