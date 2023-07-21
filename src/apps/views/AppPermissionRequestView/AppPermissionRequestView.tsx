import { AppPaths } from "@dashboard/apps/urls";
import {
  PermissionEnum,
  useAppQuery,
  useAppUpdatePermissionsMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useLocation, useParams } from "react-router";
import Link from "@dashboard/components/Link";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => {
    const params = new URLSearchParams(search);

    return Object.fromEntries(params) as Record<string, string>;
  }, [search]);
}

export const AppPermissionRequestView = () => {
  const params = useParams();
  const query = useQuery();
  const { data } = useAppQuery({
    variables: {
      id: params.id,
    },
  });
  const [updatePermissions, mutationData] = useAppUpdatePermissionsMutation();

  const navigate = useNavigator();

  const requestedPermissions = query?.permissions?.split(
    ",",
  ) as PermissionEnum[];

  console.log(params);
  console.log(query);
  console.log(requestedPermissions);
  console.log(data);
  console.log(mutationData);

  if (!data) return null;

  return (
    <Box padding={12}>
      <Text as="h1" variant="hero" size="small" textAlign="center">
        Authorize {data.app.name}
      </Text>
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
        <Box marginY={8}>
          {requestedPermissions.map(p => (
            <Text as="p" key={p}>
              {p}
            </Text>
          ))}
        </Box>
        <Box borderTopStyle="solid" paddingTop={8} borderWidth={1} borderColor="neutralHighlight">
          <Text size="small" as="h2" variant="heading" marginBottom={2}>
            What happens if I approve?
          </Text>
          <Text size="small">
            The app{" "}
            <Text size="small" variant="bodyStrong">
              {data.app.name}
            </Text>{" "}
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
          </Text>
          <Text
            size="small"
            as="h2"
            variant="heading"
            marginBottom={2}
            marginTop={4}
          >
            What happens if I deny?
          </Text>
          <Text size="small">
            Nothing will change in terms of permissions. The Dashboard will
            redirect to the app and inform it that you denied the request.
          </Text>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={4} marginTop={12}>
          <Button variant="secondary">Deny</Button>
          <Button
            onClick={() => {
              updatePermissions({
                variables: {
                  id: params.id,
                  permissions: [
                    ...data.app.permissions.map(p => p.code),
                    ...requestedPermissions,
                  ],
                },
              }).then(() => {
                navigate(
                  AppPaths.resolveAppPath(encodeURIComponent(params.id)) +
                    `?appPath=${query.redirectPath}`,
                );
              });
            }}
          >
            Approve
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
