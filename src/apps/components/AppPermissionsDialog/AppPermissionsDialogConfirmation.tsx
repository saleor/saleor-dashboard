import { AppPermissionsDialogMessages } from "@dashboard/apps/components/AppPermissionsDialog/messages";
import { useGetAvailableAppPermissions } from "@dashboard/apps/hooks/useGetAvailableAppPermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

const messages = AppPermissionsDialogMessages.confirmation;

interface Props {
  removedPermissions: PermissionEnum[];
  addedPermissions: PermissionEnum[];
  onBack: () => void;
  onApprove: () => void;
}

export const AppPermissionsDialogConfirmation = ({
  removedPermissions,
  addedPermissions,
  onBack,
  onApprove,
}: Props) => {
  const isPermissionsAdded = addedPermissions.length > 0;
  const isPermissionsRemoved = removedPermissions.length > 0;
  const intl = useIntl();

  const { mapCodesToNames } = useGetAvailableAppPermissions();

  return (
    <Box __maxHeight={"50vh"} overflow={"auto"}>
      <Text marginBottom={2} as={"p"}>
        {intl.formatMessage(messages.summaryText)}
      </Text>
      {isPermissionsRemoved && (
        <Box marginBottom={4}>
          <Text typeSize={4} fontWeight="bold">
            {intl.formatMessage(messages.removePermissions)}
          </Text>
          {mapCodesToNames(removedPermissions).map(perm => (
            <Text as={"p"} key={perm}>
              {perm}
            </Text>
          ))}
        </Box>
      )}
      {isPermissionsAdded && (
        <Box>
          <Text typeSize={4} fontWeight="bold">
            {intl.formatMessage(messages.addPermissions)}
          </Text>
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
          {intl.formatMessage(messages.backButton)}
        </Button>
        <Button
          onClick={() => {
            onApprove();
          }}
        >
          {intl.formatMessage(messages.confirmButton)}
        </Button>
      </Box>
    </Box>
  );
};
