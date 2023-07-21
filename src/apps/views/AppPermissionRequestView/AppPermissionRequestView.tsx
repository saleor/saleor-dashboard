import { getPermissionsDiff } from "@dashboard/apps/getPermissionsDiff";
import { useGetAvailableAppPermissions } from "@dashboard/apps/hooks/useGetAvailableAppPermissions";
import { AppPaths } from "@dashboard/apps/urls";
import Link from "@dashboard/components/Link";
import {
  PermissionEnum,
  useAppQuery,
  useAppUpdatePermissionsMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Text, TextProps } from "@saleor/macaw-ui/next";
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router";

const SmallText = (props: TextProps) => <Text size="small" {...props} />;
const SmallHeading = (props: TextProps) => (
  <SmallText as="h2" variant="heading" {...props} />
);

function usePageQuery() {
  const { search } = useLocation();

  return React.useMemo(() => {
    const params = new URLSearchParams(search);

    const requestedPermissions = params
      .get("permissions")
      .split(",") as PermissionEnum[];
    const redirectPath = params.get("redirectPath");

    return {
      requestedPermissions,
      redirectPath,
    };
  }, [search]);
}

export const AppPermissionRequestView = () => {
  const params = useParams<{ id: string }>();
  const { redirectPath, requestedPermissions } = usePageQuery();

  const appId = params.id;

  const { data } = useAppQuery({
    variables: {
      id: appId,
    },
  });
  const [updatePermissions, { loading }] = useAppUpdatePermissionsMutation();

  const navigate = useNavigator();

  const { mapCodesToNames, isReady } = useGetAvailableAppPermissions();

  useEffect(() => {
    if (!data || !isReady) return;

    const diff = getPermissionsDiff(
      data.app.permissions.map(p => p.code),
      requestedPermissions,
    );

    /**
     * If app requests permissions that are already granted, redirect to app with success status
     */
    if (diff.added.length === 0) navigateToAppApproved();
  }, [data, requestedPermissions]);

  if (!data || !isReady) return null;

  const navigateToAppApproved = () => {
    navigate(
      AppPaths.resolveAppPath(encodeURIComponent(appId)) +
        `?appPath=${redirectPath}`,
    );
  };

  const navigateToAppDenied = () => {
    navigate(
      AppPaths.resolveAppPath(encodeURIComponent(appId)) +
        `?appPath=${redirectPath}&error=USER_DENIED_PERMISSIONS`,
    );
  };

  const onApprove = () => {
    updatePermissions({
      variables: {
        id: appId,
        permissions: [
          ...data.app.permissions.map(p => p.code),
          ...requestedPermissions,
        ],
      },
    }).then(navigateToAppApproved);
  };

  const onDeny = () => navigateToAppDenied();

  return (
    <Box padding={12}>
      <SmallText as="h1" variant="hero" textAlign="center">
        Authorize {data.app.name}
      </SmallText>
      <Box
        marginX="auto"
        marginY={12}
        borderColor="neutralHighlight"
        borderWidth={1}
        borderStyle="solid"
        padding={8}
        __maxWidth={"600px"}
        borderRadius={4}
      >
        <Box display="flex" gap={4}>
          <Box as="img" __width={"50px"} src={data.app.brand.logo.default} />
          <Box>
            <Text>
              <Text variant="bodyStrong">{data.app.name}</Text> by{" "}
              {data.app.author}
            </Text>
            <Text as="p" color="textNeutralSubdued">
              requests access to new permissions.
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
            <SmallHeading marginBottom={2}>Current permissions</SmallHeading>
            {data.app.permissions.map(permission => (
              <Text as="p" key={permission.code}>
                {permission.name}
              </Text>
            ))}
          </Box>
          <Box>
            <SmallHeading marginBottom={2}>Requested permissions</SmallHeading>
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
            What happens if I approve?
          </SmallHeading>
          <SmallText>
            The app <SmallText variant="bodyStrong">{data.app.name}</SmallText>{" "}
            will have access to new permissions. From now on it will be able to
            use them to perform operations these permissions allow. You should
            ensure you trust the app before you approve. Read more about
            permissions in{" "}
            <Link
              target="__blank"
              href="https://docs.saleor.io/docs/3.x/developer/permissions#app-permissions"
            >
              our docs
            </Link>
          </SmallText>
          <SmallHeading marginBottom={2} marginTop={4}>
            What happens if I deny?
          </SmallHeading>
          <SmallText>
            Nothing will change in terms of permissions. The Dashboard will
            redirect to the app and inform it that you denied the request.
          </SmallText>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={4} marginTop={12}>
          <Button disabled={loading} onClick={onDeny} variant="secondary">
            Deny
          </Button>
          <Button disabled={loading} onClick={onApprove}>
            Approve
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
