import { AppAvatarFragment, AppQuery, AppTypeEnum, PermissionEnum } from "@dashboard/graphql";

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

export const appAvatarFixture: AppAvatarFragment = {
  id: "QXBwOjE3Ng==",
  name: "app",
  __typename: "App",
  brand: null,
};
