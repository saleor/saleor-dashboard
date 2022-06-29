import {
  AppFetchMutation,
  AppQuery,
  AppsInstallationsQuery,
  AppsListQuery,
  AppTypeEnum,
  JobStatusEnum,
  PermissionEnum,
} from "@saleor/graphql";

export const appsList: AppsListQuery["apps"]["edges"] = [
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      id: "QXBwOjE3Ng==",
      isActive: true,
      name: "app",
      type: AppTypeEnum.THIRDPARTY,
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
  },
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      id: "QXBwOjE3Ng==",
      isActive: false,
      name: "app1",
      type: AppTypeEnum.THIRDPARTY,
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
  },
];

export const customAppsList: AppsListQuery["apps"]["edges"] = [
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      id: "QXBwOjE3Ng==",
      isActive: true,
      name: "app custom",
      type: AppTypeEnum.LOCAL,
      appUrl: null,
      manifestUrl: null,
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

export const appDetails: AppQuery["app"] = {
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
};

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
