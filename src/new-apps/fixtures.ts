import {
  AppFetchMutation,
  AppListItemFragment,
  AppsInstallationsQuery,
  AppTypeEnum,
  JobStatusEnum,
  PermissionEnum,
} from "@saleor/graphql";

export const installedAppsList: AppListItemFragment[] = [
  {
    __typename: "App",
    id: "QXBwOjE3Ng==",
    isActive: true,
    name: "app",
    type: AppTypeEnum.THIRDPARTY,
    version: "1.0.0",
    appUrl: null,
    manifestUrl: "http://localhost:3000/api/manifest",
    permissions: [
      {
        __typename: "Permission",
        code: PermissionEnum.MANAGE_USERS,
        name: "Manage customers.",
      },
    ],
  },
  {
    __typename: "App",
    id: "QXBwOjE3Ng==",
    isActive: false,
    name: "app1",
    type: AppTypeEnum.THIRDPARTY,
    version: "1.0.0",
    appUrl: "http://localhost:3000",
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
  },
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

export const installApp: AppFetchMutation["appFetchManifest"]["manifest"] = {
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
