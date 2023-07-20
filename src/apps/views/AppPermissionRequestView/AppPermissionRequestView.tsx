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

  const navigate = useNavigator()

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
      <Text as="h1" variant="hero" textAlign="center">
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
        <Box display="flex" justifyContent="flex-end" gap={4}>
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
                navigate(AppPaths.resolveAppPath(
                    encodeURIComponent(params.id)
                ) + `?appPath=${query.redirectPath}`)
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
