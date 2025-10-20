import Link from "@dashboard/components/Link";
import { getPermissionsDiff } from "@dashboard/extensions/getPermissionsDiff";
import { useGetAvailableAppPermissions } from "@dashboard/extensions/views/EditManifestExtension/hooks/useGetAvailableAppPermissions";
import { PermissionEnum, useAppQuery, useAppUpdatePermissionsMutation } from "@dashboard/graphql";
import { APP_PERMISSIONS_DOCS_URL } from "@dashboard/links";
import { Box, BoxProps, Button, Text, TextProps } from "@saleor/macaw-ui-next";
import { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { createAppsDebug } from "../ViewManifestExtension/utils/apps-debug";
import { appPermissionsRequestViewMessages } from "./messages";
import { usePermissionsRequestRedirects } from "./usePermissionsRequestRedirects";

const SmallText = (props: TextProps) => <Text size={3} {...props} />;
const SmallHeading = (props: TextProps) => <Text as="h2" size={4} {...props} />;
const WrapperBox = (props: BoxProps) => (
  <Box
    marginX="auto"
    marginY={12}
    borderColor="default1"
    borderWidth={1}
    borderStyle="solid"
    padding={8}
    __maxWidth={"600px"}
    borderRadius={4}
    {...props}
  />
);

function usePageQuery() {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const permissionsParams = params.get("requestedPermissions");
    const requestedPermissions = permissionsParams
      ? (permissionsParams.split(",") as PermissionEnum[])
      : [];
    const redirectPath = params.get("redirectPath");

    if (!redirectPath) throw new Error("Redirect path is required");

    return {
      requestedPermissions,
      redirectPath,
    };
  }, [search]);
}

const debug = createAppsDebug("AppPermissionRequestView");

export const EditManifestExtensionPermissions = ({ id: appId }: { id: string }) => {
  const { redirectPath, requestedPermissions } = usePageQuery();
  const { formatMessage } = useIntl();
  const { data } = useAppQuery({
    variables: {
      id: appId,
      hasManagedAppsPermission: true,
    },
  });
  const [updatePermissions, { loading }] = useAppUpdatePermissionsMutation();
  const { navigateToAppApproved, navigateToAppDenied } = usePermissionsRequestRedirects({
    appId,
    redirectPath,
  });
  const { mapCodesToNames, isReady } = useGetAvailableAppPermissions();

  useEffect(() => {
    if (!data || !data.app || !isReady) return;

    const diff = getPermissionsDiff(
      (data.app.permissions ?? []).map(p => p.code),
      requestedPermissions,
    );

    /**
     * If app requests permissions that are already granted, redirect to app with success status
     */
    if (diff.added.length === 0) navigateToAppApproved();
  }, [data, requestedPermissions]);

  if (!data || !isReady || !data.app) return null;

  const onApprove = () => {
    updatePermissions({
      variables: {
        id: appId,
        permissions: [...(data.app?.permissions ?? []).map(p => p.code), ...requestedPermissions],
      },
    })
      .then(resp => {
        const hasError = resp.data?.appUpdate?.errors?.length;

        if (hasError) {
          debug("Failed to update the app permissions");

          return navigateToAppDenied("UPDATE_PERMISSIONS_FAILED");
        }

        return navigateToAppApproved();
      })
      .catch(err => {
        debug("updatePermissions failed", err);

        return navigateToAppDenied("UPDATE_PERMISSIONS_FAILED");
      });
  };
  const onDeny = () => navigateToAppDenied("USER_DENIED_PERMISSIONS");

  return (
    <Box padding={12}>
      <Text as="h1" size={9} fontWeight="medium" textAlign="center">
        {formatMessage(appPermissionsRequestViewMessages.headerAuthorize)} {data.app.name}
      </Text>
      <WrapperBox>
        <Box display="flex" gap={4}>
          {data.app.brand?.logo.default && (
            <Box as="img" __width={"50px"} src={data.app.brand.logo.default} />
          )}
          <Box>
            <Text>
              <Text size={4} fontWeight="bold">
                {data.app.name}
              </Text>{" "}
              {formatMessage(appPermissionsRequestViewMessages.by)} {data.app.author}
            </Text>
            <Text as="p" color="default2">
              {formatMessage(appPermissionsRequestViewMessages.requestsNewPermissions)}
            </Text>
          </Box>
        </Box>
        <Box marginY={8} display="grid" gridTemplateColumns={2} gap={6}>
          <Box borderRightStyle="solid" borderWidth={1} borderColor="default1" paddingRight={6}>
            <SmallHeading marginBottom={2}>
              {formatMessage(appPermissionsRequestViewMessages.currentPermissionsHeader)}
            </SmallHeading>
            {(data.app.permissions ?? []).map(permission => (
              <Text as="p" key={permission.code}>
                {permission.name}
              </Text>
            ))}
          </Box>
          <Box>
            <SmallHeading marginBottom={2}>
              {formatMessage(appPermissionsRequestViewMessages.requestedPermissionsHeader)}
            </SmallHeading>
            {mapCodesToNames(requestedPermissions).map(permissionName => (
              <Text as="p" key={permissionName}>
                {permissionName}
              </Text>
            ))}
          </Box>
        </Box>
        <Box borderTopStyle="solid" paddingTop={8} borderWidth={1} borderColor="default1">
          <SmallHeading marginBottom={2}>
            {formatMessage(appPermissionsRequestViewMessages.approveScenarioHelperHeader)}
          </SmallHeading>
          <SmallText>
            {formatMessage(appPermissionsRequestViewMessages.approveScenarioHelperBody)}
          </SmallText>
          <SmallText as="p">
            <Link target="__blank" href={APP_PERMISSIONS_DOCS_URL}>
              {formatMessage(appPermissionsRequestViewMessages.permissionsDocsLink)}
            </Link>
          </SmallText>
          <SmallHeading marginBottom={2} marginTop={4}>
            {formatMessage(appPermissionsRequestViewMessages.denyScenarioHelperHeader)}
          </SmallHeading>
          <SmallText>
            {formatMessage(appPermissionsRequestViewMessages.denyScenarioHelperBody)}
          </SmallText>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={4} marginTop={12}>
          <Button disabled={loading} onClick={onDeny} variant="secondary">
            {formatMessage(appPermissionsRequestViewMessages.denyButton)}
          </Button>
          <Button disabled={loading} onClick={onApprove}>
            {formatMessage(appPermissionsRequestViewMessages.approveButton)}
          </Button>
        </Box>
      </WrapperBox>
    </Box>
  );
};
