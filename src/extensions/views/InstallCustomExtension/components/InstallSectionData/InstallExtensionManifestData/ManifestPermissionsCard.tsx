import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Manifest } from "../../../types";
import styles from "./InstallExtensionManifestData.module.css";
import { manifestMessages } from "./messages";

/** Permissions that reach money, staff accounts or customers' personal data. */
const SENSITIVE_PERMISSIONS = new Set<PermissionEnum>([
  PermissionEnum.HANDLE_PAYMENTS,
  PermissionEnum.MANAGE_USERS,
  PermissionEnum.MANAGE_STAFF,
  PermissionEnum.IMPERSONATE_USER,
]);

export const ManifestPermissionsCard = ({
  permissions,
}: {
  permissions: NonNullable<Manifest["permissions"]>;
}) => {
  const intl = useIntl();

  return (
    <DetailSettingsCard
      title={intl.formatMessage(manifestMessages.permissions)}
      subtitle={intl.formatMessage(manifestMessages.permissionsSubtitle)}
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
            {SENSITIVE_PERMISSIONS.has(permission.code) && (
              <Chip backgroundColor="critical1" borderColor="critical1" color="critical1">
                {intl.formatMessage(manifestMessages.sensitive)}
              </Chip>
            )}
            <Text size={2} color="default2" className={styles.mono}>
              {permission.code}
            </Text>
          </Box>
        </Box>
      ))}
    </DetailSettingsCard>
  );
};
