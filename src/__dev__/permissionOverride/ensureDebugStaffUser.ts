// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type ApolloClient } from "@apollo/client";
import { newPasswordUrl } from "@dashboard/auth/urls";
import { type PermissionEnum } from "@dashboard/graphql";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { buildDebugStaffEmail } from "./debugStaffEmail";
import {
  permissionGroupCreateDocument,
  searchPermissionGroupByNameDocument,
  searchStaffByEmailDocument,
  staffCreateDocument,
} from "./debugStaffGraphql";
import { buildPermissionGroupName, hashPermissions } from "./permissionsHash";

interface GraphQLErrorField {
  message: string | null;
}

interface SearchPermissionGroupByNameData {
  permissionGroups?: {
    edges?: Array<{ node: { id: string; name: string } }>;
  } | null;
}

interface SearchStaffByEmailData {
  staffUsers?: {
    edges?: Array<{ node: { id: string; email: string } }>;
  } | null;
}

interface PermissionGroupCreateData {
  permissionGroupCreate?: {
    errors: GraphQLErrorField[];
    group?: { id: string; name: string } | null;
  } | null;
}

interface StaffCreateData {
  staffCreate?: {
    errors: GraphQLErrorField[];
    user?: { id: string; email: string } | null;
  } | null;
}

interface EnsureDebugStaffUserInput {
  apolloClient: ApolloClient<unknown>;
  baseEmail: string;
  permissions: PermissionEnum[];
}

export type EnsureDebugStaffUserResult =
  | {
      status: "ready";
      debugEmail: string;
      hash: string;
      groupId: string;
      staffCreated: boolean;
    }
  | {
      status: "error";
      message: string;
    };

const getStaffPasswordRedirectUrl = (): string =>
  urlJoin(window.location.origin, getAppMountUriForRedirect(), newPasswordUrl().replace(/\?/, ""));

export const ensureDebugStaffUser = async ({
  apolloClient,
  baseEmail,
  permissions,
}: EnsureDebugStaffUserInput): Promise<EnsureDebugStaffUserResult> => {
  try {
    const hash = await hashPermissions(permissions);
    const groupName = buildPermissionGroupName(hash);
    const debugEmail = buildDebugStaffEmail(baseEmail, hash);

    const groupSearch = await apolloClient.query<SearchPermissionGroupByNameData>({
      query: searchPermissionGroupByNameDocument,
      variables: { query: groupName },
      fetchPolicy: "network-only",
    });

    const existingGroup = groupSearch.data?.permissionGroups?.edges?.find(
      (edge: { node: { id: string; name: string } }) => edge.node.name === groupName,
    )?.node;

    let groupId = existingGroup?.id;

    if (!groupId) {
      const groupCreateResult = await apolloClient.mutate<PermissionGroupCreateData>({
        mutation: permissionGroupCreateDocument,
        variables: {
          input: {
            name: groupName,
            addPermissions: permissions,
            restrictedAccessToChannels: false,
          },
        },
      });

      const groupErrors = groupCreateResult.data?.permissionGroupCreate?.errors ?? [];

      if (groupErrors.length > 0) {
        return {
          status: "error",
          message: groupErrors
            .map((error: GraphQLErrorField) => error.message)
            .filter(Boolean)
            .join(" "),
        };
      }

      groupId = groupCreateResult.data?.permissionGroupCreate?.group?.id;

      if (!groupId) {
        return {
          status: "error",
          message: "Permission group was not created.",
        };
      }
    }

    const staffSearch = await apolloClient.query<SearchStaffByEmailData>({
      query: searchStaffByEmailDocument,
      variables: { query: debugEmail },
      fetchPolicy: "network-only",
    });

    const existingStaff = staffSearch.data?.staffUsers?.edges?.find(
      (edge: { node: { id: string; email: string } }) => edge.node.email === debugEmail,
    )?.node;

    if (existingStaff) {
      return {
        status: "ready",
        debugEmail,
        hash,
        groupId,
        staffCreated: false,
      };
    }

    const staffCreateResult = await apolloClient.mutate<StaffCreateData>({
      mutation: staffCreateDocument,
      variables: {
        input: {
          email: debugEmail,
          firstName: "Dev",
          lastName: `Debug ${hash}`,
          isActive: true,
          addGroups: [groupId],
          redirectUrl: getStaffPasswordRedirectUrl(),
          metadata: [{ key: "dev:debugStaff", value: hash }],
        },
      },
    });

    const staffErrors = staffCreateResult.data?.staffCreate?.errors ?? [];

    if (staffErrors.length > 0) {
      return {
        status: "error",
        message: staffErrors
          .map((error: GraphQLErrorField) => error.message)
          .filter(Boolean)
          .join(" "),
      };
    }

    return {
      status: "ready",
      debugEmail,
      hash,
      groupId,
      staffCreated: true,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to prepare debug staff user.",
    };
  }
};
