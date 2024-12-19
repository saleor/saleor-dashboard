import { AppPermissionsDialogMessages } from "@dashboard/apps/components/AppPermissionsDialog/messages";
import { useGetAvailableAppPermissions } from "@dashboard/apps/hooks/useGetAvailableAppPermissions";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
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
          <Text size={4} fontWeight="bold">
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
          <Text size={4} fontWeight="bold">
            {intl.formatMessage(messages.addPermissions)}
          </Text>
          {mapCodesToNames(addedPermissions).map(perm => (
            <Text as={"p"} key={perm}>
              {perm}
            </Text>
          ))}
        </Box>
      )}

      <Box marginBottom={6} />

      <DashboardModal.Actions>
        <BackButton onClick={onBack}>{intl.formatMessage(messages.backButton)}</BackButton>
        <ConfirmButton data-test-id="submit" transitionState="default" onClick={onApprove}>
          {intl.formatMessage(messages.confirmButton)}
        </ConfirmButton>
      </DashboardModal.Actions>
    </Box>
  );
};
