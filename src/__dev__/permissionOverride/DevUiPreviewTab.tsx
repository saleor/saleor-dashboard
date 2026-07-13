// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import { Box, Button, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";

import { ALL_SALEOR_PERMISSIONS, getPermissionLabel } from "./allPermissions";
import { DevPanelWarningCallout } from "./DevPanelWarningCallout";
import styles from "./DevPermissionOverride.module.css";
import { DevPermissionPresets } from "./DevPermissionPresets";
import { permissionOverrideStore } from "./store";
import { type DevPanelTab } from "./useDevPermissionPanel";

interface DevUiPreviewTabProps {
  onSwitchTab: (tab: DevPanelTab) => void;
  override: PermissionEnum[] | null;
  realPermissionCodes: PermissionEnum[];
}

export const DevUiPreviewTab = ({
  onSwitchTab,
  override,
  realPermissionCodes,
}: DevUiPreviewTabProps): JSX.Element => {
  const shop = useShop();
  const [search, setSearch] = useState("");
  const isActive = override !== null;
  const effectiveCount = override?.length ?? realPermissionCodes.length;

  const permissionNameByCode = useMemo(() => {
    const map = new Map<PermissionEnum, string>();

    shop?.permissions?.forEach(permission => {
      map.set(permission.code, permission.name);
    });

    return map;
  }, [shop?.permissions]);

  const filteredPermissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return ALL_SALEOR_PERMISSIONS;
    }

    return ALL_SALEOR_PERMISSIONS.filter(code => {
      const label = getPermissionLabel(code, permissionNameByCode);

      return code.toLowerCase().includes(query) || label.toLowerCase().includes(query);
    });
  }, [permissionNameByCode, search]);

  const applyPermissions = (permissions: PermissionEnum[]): void => {
    if (permissions.length === 0) {
      permissionOverrideStore.clearOverride();

      return;
    }

    permissionOverrideStore.setOverride(permissions);
  };

  const handlePermissionChange = (
    code: PermissionEnum,
    checked: boolean | "indeterminate",
  ): void => {
    if (checked !== true) {
      if (override === null) {
        return;
      }

      const next = override.filter(permission => permission !== code);

      applyPermissions(next);

      return;
    }

    const current = override ?? [];

    if (current.includes(code)) {
      return;
    }

    applyPermissions([...current, code]);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} className={styles.tabContent}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
          <Text size={2} fontWeight="medium">
            {isActive
              ? `Override active — ${override?.length ?? 0} permissions`
              : "Using real API permissions"}
          </Text>
          {isActive && (
            <Button
              size="small"
              variant="tertiary"
              onClick={() => permissionOverrideStore.clearOverride()}
            >
              Reset
            </Button>
          )}
        </Box>
        <Text size={1} color="default2">
          Dashboard UI only — menus, routes, and guards.
        </Text>
        <DevPanelWarningCallout>Does not change JWTs or app tokens.</DevPanelWarningCallout>
      </Box>

      <DevPermissionPresets
        onApply={applyPermissions}
        realPermissionCodes={realPermissionCodes}
        selectedPermissions={override}
      />

      <Input
        size="small"
        placeholder="Filter permissions…"
        value={search}
        onChange={event => setSearch(event.target.value)}
      />

      <Box className={styles.permissionList}>
        {filteredPermissions.length === 0 ? (
          <Text size={2} color="default2">
            No permissions match your filter.
          </Text>
        ) : (
          filteredPermissions.map(code => {
            const label = getPermissionLabel(code, permissionNameByCode);
            const hasRealPermission = realPermissionCodes.includes(code);

            return (
              <Checkbox
                key={code}
                checked={override?.includes(code) ?? false}
                onCheckedChange={checked => handlePermissionChange(code, checked)}
              >
                <Box display="flex" flexDirection="column" __marginTop="-2px">
                  <Text size={2}>{label.replace(/\.$/, "")}</Text>
                  <Text size={1} color={hasRealPermission ? "default1" : "default2"}>
                    {code}
                    {hasRealPermission ? " · granted by API" : ""}
                  </Text>
                </Box>
              </Checkbox>
            );
          })
        )}
      </Box>

      <Button size="small" variant="secondary" onClick={() => onSwitchTab("real-session")}>
        Use {effectiveCount} permission{effectiveCount === 1 ? "" : "s"} in Real session →
      </Button>
    </Box>
  );
};
