// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";

import { getPermissionLabel } from "./allPermissions";
import styles from "./DevPermissionOverride.module.css";

interface DebugStaffPermissionsListProps {
  permissions: PermissionEnum[];
}

export const DebugStaffPermissionsList = ({
  permissions,
}: DebugStaffPermissionsListProps): JSX.Element => {
  const shop = useShop();

  const permissionNameByCode = useMemo(() => {
    const map = new Map<PermissionEnum, string>();

    shop?.permissions?.forEach(permission => {
      map.set(permission.code, permission.name);
    });

    return map;
  }, [shop?.permissions]);

  const sortedPermissions = useMemo(
    () => [...permissions].sort((left, right) => left.localeCompare(right)),
    [permissions],
  );

  if (sortedPermissions.length === 0) {
    return (
      <Text size={1} color="default2">
        No permissions assigned.
      </Text>
    );
  }

  return (
    <Box className={styles.profilePermissions}>
      {sortedPermissions.map(code => (
        <Text key={code} size={1} color="default2">
          {getPermissionLabel(code, permissionNameByCode).replace(/\.$/, "")}
          <Text as="span" size={1} fontFamily="Geist Mono" color="default2">
            {" "}
            · {code}
          </Text>
        </Text>
      ))}
    </Box>
  );
};
