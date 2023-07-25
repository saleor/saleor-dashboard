import { createAppsDebug } from "@dashboard/apps/apps-debug";
import { getPermissionsDiff } from "@dashboard/apps/getPermissionsDiff";
import { useGetAvailableAppPermissions } from "@dashboard/apps/hooks/useGetAvailableAppPermissions";
import Link from "@dashboard/components/Link";
import {
  PermissionEnum,
  useAppQuery,
  useAppUpdatePermissionsMutation,
} from "@dashboard/graphql";
import { Box, BoxProps, Button, Text, TextProps } from "@saleor/macaw-ui/next";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useLocation, useParams } from "react-router";

import { appPermissionsRequestViewMessages } from "./messages";
import { usePermissionsRequestRedirects } from "./usePermissionsRequestRedirects";

const SmallText = (props: TextProps) => <Text size="small" {...props} />;
const SmallHeading = (props: TextProps) => (
  <SmallText as="h2" variant="heading" {...props} />
);
const WrapperBox = (props: BoxProps) => (
  <Box
    marginX="auto"
    marginY={12}
    borderColor="neutralHighlight"
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

  return React.useMemo(() => {
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

export const AppPermissionRequestView = () => {
  const params = useParams<{ id: string }>();
  const { redirectPath, requestedPermissions } = usePageQuery();
  const { formatMessage } = useIntl();

  const appId = params.id;

  const { data } = useAppQuery({
    variables: {
      id: appId,
    },
  });
  const [updatePermissions, { loading }] = useAppUpdatePermissionsMutation();

  const { navigateToAppApproved, navigateToAppDenied } =
    usePermissionsRequestRedirects({
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
        permissions: [
          ...(data.app?.permissions ?? []).map(p => p.code),
          ...requestedPermissions,
        ],
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
      <SmallText as="h1" variant="hero" textAlign="center">
        {formatMessage(appPermissionsRequestViewMessages.headerAuthorize)}{" "}
        {data.app.name}
      </SmallText>
      <WrapperBox>
        <Box display="flex" gap={4}>
          {data.app.brand?.logo.default && (
            <Box as="img" __width={"50px"} src={data.app.brand.logo.default} />
          )}
          <Box>
            <Text>
              <Text variant="bodyStrong">{data.app.name}</Text>{" "}
              {formatMessage(appPermissionsRequestViewMessages.by)}{" "}
              {data.app.author}
            </Text>
            <Text as="p" color="textNeutralSubdued">
              {formatMessage(
                appPermissionsRequestViewMessages.requestsNewPermissions,
              )}
            </Text>
          </Box>
        </Box>
        <Box marginY={8} display="grid" gridTemplateColumns={2} gap={6}>
          <Box
            borderRightStyle="solid"
            borderWidth={1}
            borderColor="neutralHighlight"
            paddingRight={6}
          >
            <SmallHeading marginBottom={2}>
              {formatMessage(
                appPermissionsRequestViewMessages.currentPermissionsHeader,
              )}
            </SmallHeading>
            {(data.app.permissions ?? []).map(permission => (
              <Text as="p" key={permission.code}>
                {permission.name}
              </Text>
            ))}
          </Box>
          <Box>
            <SmallHeading marginBottom={2}>
              {formatMessage(
                appPermissionsRequestViewMessages.requestedPermissionsHeader,
              )}
            </SmallHeading>
            {mapCodesToNames(requestedPermissions).map(permissionName => (
              <Text as="p" key={permissionName}>
                {permissionName}
              </Text>
            ))}
          </Box>
        </Box>
        <Box
          borderTopStyle="solid"
          paddingTop={8}
          borderWidth={1}
          borderColor="neutralHighlight"
        >
          <SmallHeading marginBottom={2}>
            {formatMessage(
              appPermissionsRequestViewMessages.approveScenarioHelperHeader,
            )}
          </SmallHeading>
          <SmallText>
            {formatMessage(
              appPermissionsRequestViewMessages.approveScenarioHelperBody,
            )}
          </SmallText>
          <SmallText as="p">
            <Link
              target="__blank"
              href="https://docs.saleor.io/docs/3.x/developer/permissions#app-permissions"
            >
              {formatMessage(
                appPermissionsRequestViewMessages.permissionsDocsLink,
              )}
            </Link>
          </SmallText>
          <SmallHeading marginBottom={2} marginTop={4}>
            {formatMessage(
              appPermissionsRequestViewMessages.denyScenarioHelperHeader,
            )}
          </SmallHeading>
          <SmallText>
            {formatMessage(
              appPermissionsRequestViewMessages.denyScenarioHelperBody,
            )}
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
