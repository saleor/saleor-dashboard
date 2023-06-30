import { useGetAvailableAppPermissions } from "@dashboard/apps/components/AppPermissionsDialog/useGetAvailableAppPermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";

interface Props {
  removedPermissions: PermissionEnum[];
  addedPermissions: PermissionEnum[];
  onBack(): void;
  onApprove(): void;
}

export const AppPermissionsDialogConfirmation = ({
  removedPermissions,
  addedPermissions,
  onBack,
  onApprove,
}: Props) => {
  const hasAdded = addedPermissions.length > 0;
  const hasRemoved = removedPermissions.length > 0;

  const { mapCodesToNames } = useGetAvailableAppPermissions();

  return (
    <Box>
      <Text marginBottom={2} as={"p"}>
        You are going to
      </Text>
      {hasRemoved && (
        <Box marginBottom={4}>
          <Text variant={"bodyStrong"}>Remove following permissions:</Text>
          {mapCodesToNames(removedPermissions).map(perm => (
            <Text as={"p"} key={perm}>
              {perm}
            </Text>
          ))}
        </Box>
      )}
      {hasAdded && (
        <Box>
          <Text variant={"bodyStrong"}>Add following permissions:</Text>
          {mapCodesToNames(addedPermissions).map(perm => (
            <Text as={"p"} key={perm}>
              {perm}
            </Text>
          ))}
        </Box>
      )}
      <Box display={"flex"} justifyContent={"flex-end"} gap={2} marginTop={6}>
        <Button
          variant={"tertiary"}
          onClick={() => {
            onBack();
          }}
        >
          Go back
        </Button>
        <Button
          onClick={() => {
            onApprove();
          }}
        >
          I know what I'm doing - confirm
        </Button>
      </Box>
    </Box>
  );
};
