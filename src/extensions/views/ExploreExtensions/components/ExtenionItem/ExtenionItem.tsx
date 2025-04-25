import { DashboardCard } from "@dashboard/components/Card";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { ExtensionData } from "@dashboard/extensions/types";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";

import { InstalledBadge } from "./components/InstalledBadge";
import { PluginWarning } from "./components/PluginWarning";
import { useExtension } from "./hooks/useExtension";

interface ExtensionItemProps {
  extension: ExtensionData;
}

export const ExtensionItem = ({ extension }: ExtensionItemProps) => {
  const { type, title, subtitle, description, avatar, actions, isInstalled } =
    useExtension(extension);
  const { theme } = useTheme();
  const textColor = theme === "defaultDark" ? "default1" : "default2";

  return (
    <DashboardCard borderColor="default1" borderStyle="solid" borderWidth={1} borderRadius={5}>
      <DashboardCard.Header alignItems="flex-start">
        <Box display="flex" gap={4}>
          <ExtensionAvatar>{avatar}</ExtensionAvatar>

          <Box>
            <DashboardCard.Title fontSize={6}>{title}</DashboardCard.Title>
            <DashboardCard.Subtitle fontSize={2}>{subtitle}</DashboardCard.Subtitle>
          </Box>
        </Box>

        {isInstalled && <InstalledBadge />}
      </DashboardCard.Header>

      <DashboardCard.Content>
        <Text size={4} color={textColor}>
          {description}
        </Text>

        {type === "PLUGIN" && <PluginWarning color={textColor} />}
      </DashboardCard.Content>
      <DashboardCard.BottomActions gap={6} marginTop="auto" paddingTop={2} paddingBottom={5}>
        {actions}
      </DashboardCard.BottomActions>
    </DashboardCard>
  );
};
