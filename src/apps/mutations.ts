import { appFragment } from "@saleor/fragments/apps";
import { appErrorFragment } from "@saleor/fragments/errors";
import { webhooksFragment } from "@saleor/fragments/webhooks";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { AppActivate, AppActivateVariables } from "./types/AppActivate";
import { AppCreate, AppCreateVariables } from "./types/AppCreate";
import { AppDeactivate, AppDeactivateVariables } from "./types/AppDeactivate";
import { AppDelete, AppDeleteVariables } from "./types/AppDelete";
import {
  AppDeleteFailedInstallation,
  AppDeleteFailedInstallationVariables
} from "./types/AppDeleteFailedInstallation";
import { AppFetch, AppFetchVariables } from "./types/AppFetch";
import { AppInstall, AppInstallVariables } from "./types/AppInstall";
import {
  AppRetryInstall,
  AppRetryInstallVariables
} from "./types/AppRetryInstall";
import {
  AppTokenCreate,
  AppTokenCreateVariables
} from "./types/AppTokenCreate";
import {
  AppTokenDelete,
  AppTokenDeleteVariables
} from "./types/AppTokenDelete";
import { AppUpdate, AppUpdateVariables } from "./types/AppUpdate";

export const appCreateMutation = gql`
  ${appFragment}
  ${webhooksFragment}
  ${appErrorFragment}
  mutation AppCreate($input: AppInput!) {
    appCreate(input: $input) {
      authToken
      app {
        ...AppFragment
      }
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appDeleteMutation = gql`
  ${appFragment}
  ${webhooksFragment}
  ${appErrorFragment}
  mutation AppDelete($id: ID!) {
    appDelete(id: $id) {
      app {
        ...AppFragment
      }
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appDeleteFailedInstallationMutation = gql`
  ${appErrorFragment}
  mutation AppDeleteFailedInstallation($id: ID!) {
    appDeleteFailedInstallation(id: $id) {
      appInstallation {
        id
        status
        appName
        message
      }
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appFetchMutation = gql`
  mutation AppFetch($manifestUrl: String!) {
    appFetchManifest(manifestUrl: $manifestUrl) {
      manifest {
        identifier
        version
        about
        name
        appUrl
        configurationUrl
        tokenTargetUrl
        dataPrivacy
        dataPrivacyUrl
        homepageUrl
        supportUrl
        permissions {
          code
          name
        }
      }
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appInstallMutation = gql`
  ${appErrorFragment}
  mutation AppInstall($input: AppInstallInput!) {
    appInstall(input: $input) {
      appInstallation {
        id
        status
        appName
        manifestUrl
      }
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appRetryInstallMutation = gql`
  ${appErrorFragment}
  mutation AppRetryInstall($id: ID!) {
    appRetryInstall(id: $id) {
      appInstallation {
        id
        status
        appName
        manifestUrl
      }
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appActivateMutation = gql`
  ${appErrorFragment}
  mutation AppActivate($id: ID!) {
    appActivate(id: $id) {
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appDeactivateMutation = gql`
  ${appErrorFragment}
  mutation AppDeactivate($id: ID!) {
    appDeactivate(id: $id) {
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appUpdateMutation = gql`
  ${appErrorFragment}
  ${appFragment}
  ${webhooksFragment}
  mutation AppUpdate($id: ID!, $input: AppInput!) {
    appUpdate(id: $id, input: $input) {
      app {
        ...AppFragment
        permissions {
          code
          name
        }
      }
      errors: appErrors {
        ...AppErrorFragment
        message
        permissions
      }
    }
  }
`;

export const appTokenCreateMutation = gql`
  ${appErrorFragment}
  mutation AppTokenCreate($input: AppTokenInput!) {
    appTokenCreate(input: $input) {
      appToken {
        name
        authToken
        id
      }
      authToken
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appTokenDeleteMutation = gql`
  ${appErrorFragment}
  mutation AppTokenDelete($id: ID!) {
    appTokenDelete(id: $id) {
      appToken {
        name
        authToken
        id
      }
      errors: appErrors {
        ...AppErrorFragment
      }
    }
  }
`;

export const useAppCreateMutation = makeMutation<AppCreate, AppCreateVariables>(
  appCreateMutation
);

export const useAppDeleteMutation = makeMutation<AppDelete, AppDeleteVariables>(
  appDeleteMutation
);

export const useAppDeleteFailedInstallationMutation = makeMutation<
  AppDeleteFailedInstallation,
  AppDeleteFailedInstallationVariables
>(appDeleteFailedInstallationMutation);

export const useAppInstallMutation = makeMutation<
  AppInstall,
  AppInstallVariables
>(appInstallMutation);

export const useAppRetryInstallMutation = makeMutation<
  AppRetryInstall,
  AppRetryInstallVariables
>(appRetryInstallMutation);

export const useAppManifestFetchMutation = makeMutation<
  AppFetch,
  AppFetchVariables
>(appFetchMutation);

export const useAppActivateMutation = makeMutation<
  AppActivate,
  AppActivateVariables
>(appActivateMutation);

export const useAppDeactivateMutation = makeMutation<
  AppDeactivate,
  AppDeactivateVariables
>(appDeactivateMutation);

export const useAppUpdateMutation = makeMutation<AppUpdate, AppUpdateVariables>(
  appUpdateMutation
);

export const useAppTokenCreateMutation = makeMutation<
  AppTokenCreate,
  AppTokenCreateVariables
>(appTokenCreateMutation);

export const useAppTokenDeleteMutation = makeMutation<
  AppTokenDelete,
  AppTokenDeleteVariables
>(appTokenDeleteMutation);
