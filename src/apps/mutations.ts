import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { appFragment } from "./queries";
import { AppCreate, AppCreateVariables } from "./types/AppCreate";
import { AppDelete, AppDeleteVariables } from "./types/AppDelete";
import { AppFetch, AppFetchVariables } from "./types/AppFetch";
import { AppInstall, AppInstallVariables } from "./types/AppInstall";

export const appCreateMutation = gql`
  ${appFragment}
  mutation AppCreate($input: AppInput!) {
    appCreate(input: $input) {
      authToken
      app {
        ...AppFragment
      }
      appErrors {
        field
        message
        code
        permissions
      }
    }
  }
`;

export const appDeleteMutation = gql`
  ${appFragment}
  mutation AppDelete($id: ID!) {
    appDelete(id: $id) {
      app {
        ...AppFragment
      }
      appErrors {
        field
        message
        code
        permissions
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
      appErrors {
        field
        message
        code
      }
    }
  }
`;

export const appInstallMutation = gql`
  mutation AppInstall($input: AppInstallInput!) {
    appInstall(input: $input) {
      appInstallation {
        id
        status
        appName
        manifestUrl
      }
      appErrors {
        field
        message
        code
        permissions
      }
    }
  }
`;

export const appRetryInstallMutation = gql`
  mutation AppRetryInstall($id: ID!) {
    appRetryInstall(id: $id) {
      appInstallation {
        id
        status
        appName
        manifestUrl
      }
      appErrors {
        field
        message
        code
        permissions
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
