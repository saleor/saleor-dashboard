import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { DashboardCard } from "@dashboard/components/Card";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type Extension } from "@dashboard/extensions/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { PREFERENCE_ENABLED_MOUNTS } from "./constants";
import { ExtensionPreferenceStateControl } from "./ExtensionPreferenceStateControl";
import { groupExtensionsByApp } from "./groupExtensionsByApp";
import { extensionPreferencesMessages as m } from "./messages";
import { useExtensionPreferences } from "./useExtensionPreferences";

export const ExtensionPreferencesSection = () => {
  const intl = useIntl();
  const userPermissions = useUserPermissions();
  const extensionsByMount = useExtensions(PREFERENCE_ENABLED_MOUNTS);
  const { getState, setState, isSaving } = useExtensionPreferences();

  const groups = useMemo(() => {
    const all: Extension[] = Object.values(extensionsByMount).flat();
    const visible = all.filter(extension =>
      hasPermissions(userPermissions ?? [], extension.permissions),
    );

    return groupExtensionsByApp(visible);
  }, [extensionsByMount, userPermissions]);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(m.sectionTitle)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text as="p" color="default2" marginBottom={4}>
          {intl.formatMessage(m.sectionSubtitle)}
        </Text>

        {groups.length === 0 ? (
          <Text color="default2">{intl.formatMessage(m.emptyState)}</Text>
        ) : (
          <Box display="flex" flexDirection="column" gap={6}>
            {groups.map(group => (
              <Box key={group.app.id} display="flex" flexDirection="column" gap={2}>
                <Text fontWeight="bold">{group.app.name}</Text>
                {group.extensions.map(extension => (
                  <Box
                    key={extension.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={4}
                  >
                    <Box display="flex" flexDirection="column">
                      <Text>{extension.label}</Text>
                      <Text size={2} color="default2">
                        {extension.mountName}
                      </Text>
                    </Box>
                    <ExtensionPreferenceStateControl
                      value={getState(extension)}
                      disabled={isSaving}
                      onChange={next => setState(extension, next)}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
