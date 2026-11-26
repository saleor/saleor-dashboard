import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import styles from "./AppDefinition.module.css";
import { type AppDefinitionPermission } from "./appEndpoints";
import { manifestMessages } from "./messages";

/** Permissions that reach money, staff accounts or customers' personal data. */
const SENSITIVE_PERMISSIONS = new Set<PermissionEnum>([
  PermissionEnum.HANDLE_PAYMENTS,
  PermissionEnum.MANAGE_USERS,
  PermissionEnum.MANAGE_STAFF,
  PermissionEnum.IMPERSONATE_USER,
]);

const SensitivePermissionChip = () => {
  const intl = useIntl();

  return (
    <Chip backgroundColor="critical1" borderColor="critical1" color="critical1">
      {intl.formatMessage(manifestMessages.sensitive)}
    </Chip>
  );
};

export const AppPermissionsCard = ({
  permissions,
  headerEnd,
}: {
  permissions: AppDefinitionPermission[];
  headerEnd?: ReactNode;
}) => {
  const intl = useIntl();

  return (
    <DetailSettingsCard
      title={intl.formatMessage(manifestMessages.permissions)}
      subtitle={intl.formatMessage(manifestMessages.permissionsSubtitle)}
      headerEnd={headerEnd}
      contentFlush
    >
      {permissions.length === 0 && (
        <Box className={styles.row}>
          <Text size={3} color="default2">
            {intl.formatMessage(manifestMessages.noPermissions)}
          </Text>
        </Box>
      )}
      {permissions.map(permission => (
        <Box key={permission.code} className={styles.row}>
          <Text size={3}>{permission.name}</Text>
          <Box display="flex" alignItems="center" gap={2}>
            {SENSITIVE_PERMISSIONS.has(permission.code) && <SensitivePermissionChip />}
            <Text size={2} color="default2" className={styles.mono}>
              {permission.code}
            </Text>
          </Box>
        </Box>
      ))}
    </DetailSettingsCard>
  );
};
