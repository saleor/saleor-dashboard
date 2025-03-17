import { DashboardCard } from "@dashboard/components/Card";
import { InstalledBadge } from "@dashboard/extensions/components/ExtenionItem/InstalledBadge";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const ExtensionItem = () => {
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
              src="https://master.staging.saleor.cloud/media/thumbnails/app-brand-data/logo_e872385d_thumbnail_64.webp"
            />
          </Box>

          <Box>
            <DashboardCard.Title fontSize={6}>Avatax</DashboardCard.Title>
            <DashboardCard.Subtitle fontSize={2}>
              Developed by Saleor Commrce
            </DashboardCard.Subtitle>
          </Box>
        </Box>

        <InstalledBadge />
      </DashboardCard.Header>

      <DashboardCard.Content>
        <Text size={4} color="default2">
          Automate your tax management process by integrating Saleor with AvaTax, a leading
          cloud-based tax calculation software.
        </Text>
      </DashboardCard.Content>
      <DashboardCard.BottomActions gap={6}>
        <Button variant="secondary">Install</Button>
        <Button variant="secondary">View on Github</Button>
      </DashboardCard.BottomActions>
    </DashboardCard>
  );
};
