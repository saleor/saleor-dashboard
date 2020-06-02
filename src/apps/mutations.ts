import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { appFragment } from "./queries";
import { AppCreate, AppCreateVariables } from "./types/AppCreate";
import { AppDelete, AppDeleteVariables } from "./types/AppDelete";
import { AppFetch, AppFetchVariables } from "./types/AppFetch";
import { AppInstall, AppInstallVariables } from "./types/AppInstall";

export const appError = gql`
  fragment AppErrorFragment on AppError {
    field
    message
    code
    permissions
  }
`;

export const appCreateMutation = gql`
  ${appFragment}
  ${appError}
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
  ${appError}
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
        field
        message
        code
      }
    }
  }
`;

export const appInstallMutation = gql`
  ${appError}
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
  ${appError}
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

export const useAppCreate = makeMutation<AppCreate, AppCreateVariables>(
  appCreateMutation
);

export const useAppDelete = makeMutation<AppDelete, AppDeleteVariables>(
  appDeleteMutation
);

export const useAppInstallMutation = makeMutation<
  AppInstall,
  AppInstallVariables
>(appInstallMutation);

export const useAppRetryInstallMutation = makeMutation(appRetryInstallMutation);

export const useAppManifestFetchMutation = makeMutation<
  AppFetch,
  AppFetchVariables
>(appFetchMutation);
