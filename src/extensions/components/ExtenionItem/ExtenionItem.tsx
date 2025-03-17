import { DashboardCard } from "@dashboard/components/Card";
import { InstalledBadge } from "@dashboard/extensions/components/ExtenionItem/InstalledBadge";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface ExtensionItemProps {
  title: string;
  subtitle: string;
  description: string;
  avatarUrl: string;
  actions: React.ReactNode;
  isInstalled?: boolean;
}

export const ExtensionItem = ({
  title,
  subtitle,
  description,
  avatarUrl,
  actions,
  isInstalled,
}: ExtensionItemProps) => {
  return (
    <DashboardCard borderColor="default1" borderStyle="solid" borderWidth={1} borderRadius={5}>
      <DashboardCard.Header alignItems="flex-start">
        <Box display="flex" gap={4}>
          <Box __width="40px" __height="40px">
            <Box
              as="img"
              display="block"
              maxWidth="100%"
              borderRadius={5}
              borderColor="default1"
              borderStyle="solid"
              borderWidth={1}
              src={avatarUrl}
            />
          </Box>

          <Box>
            <DashboardCard.Title fontSize={6}>{title}</DashboardCard.Title>
            <DashboardCard.Subtitle fontSize={2}>{subtitle}</DashboardCard.Subtitle>
          </Box>
        </Box>

        {isInstalled && <InstalledBadge />}
      </DashboardCard.Header>

      <DashboardCard.Content>
        <Text size={4} color="default2">
          {description}
        </Text>
      </DashboardCard.Content>
      <DashboardCard.BottomActions gap={6}>{actions}</DashboardCard.BottomActions>
    </DashboardCard>
  );
};
