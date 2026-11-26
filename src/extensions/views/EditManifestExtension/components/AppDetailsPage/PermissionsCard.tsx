import { ButtonWithTooltip } from "@dashboard/components/ButtonWithTooltip/ButtonWithTooltip";
import { type AppDefinitionPermission } from "@dashboard/extensions/components/AppDefinition/appEndpoints";
import { AppPermissionsCard } from "@dashboard/extensions/components/AppDefinition/AppPermissionsCard";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages } from "@dashboard/intl";
import { useState } from "react";
import { useIntl } from "react-intl";

import { AppPermissionsDialog } from "../AppPermissionsDialog/AppPermissionsDialog";
import messages from "./messages";

export const PermissionsCard = ({
  permissions,
  appId,
}: {
  permissions: AppDefinitionPermission[];
  appId: string;
}) => {
  const [editPermissionDialogOpen, setEditPermissionDialogOpen] = useState(false);
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  return (
    <>
      {editPermissionDialogOpen && (
        <AppPermissionsDialog
          appId={appId}
          onClose={() => setEditPermissionDialogOpen(false)}
          assignedPermissions={permissions.map(p => p.code)}
        />
      )}
      <AppPermissionsCard
        permissions={permissions}
        headerEnd={
          <ButtonWithTooltip
            tooltip={
              !hasManagedAppsPermission
                ? intl.formatMessage(buttonMessages.noPermission)
                : undefined
            }
            variant="secondary"
            size="small"
            data-test-id="app-edit-permissions-button"
            disabled={!hasManagedAppsPermission}
            onClick={() => setEditPermissionDialogOpen(true)}
          >
            {intl.formatMessage(messages.editPermissionsButton)}
          </ButtonWithTooltip>
        }
      />
    </>
  );
};
