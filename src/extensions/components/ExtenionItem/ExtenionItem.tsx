import { DashboardCard } from "@dashboard/components/Card";
import { CheckIcon } from "@saleor/macaw-ui";
import { Box, Button } from "@saleor/macaw-ui-next";
import React from "react";

export const ExtensionItem = () => {
  return (
    <DashboardCard borderColor="default1" borderStyle="solid" borderWidth="1" borderRadius={5}>
      <DashboardCard.Header>
        <Box display="flex" gap={6}>
          <Box __width="40px" __height="40px">
            <Box
              as="img"
              display="block"
              maxWidth="100%"
              borderRadius={5}
              borderColor="default1"
              borderStyle="solid"
              borderWidth="1"
              src="https://master.staging.saleor.cloud/media/thumbnails/app-brand-data/logo_e872385d_thumbnail_64.webp"
            />
          </Box>

          <Box>
            <DashboardCard.Title>Avatax</DashboardCard.Title>
            <DashboardCard.Subtitle>Developed by Saleor Commrce</DashboardCard.Subtitle>
          </Box>
        </Box>

        <Box>
          <CheckIcon />
          Installed
        </Box>
      </DashboardCard.Header>

      <DashboardCard.Content>
        Automate your tax management process by integrating Saleor with AvaTax, a leading
        cloud-based tax calculation software.
      </DashboardCard.Content>
      <DashboardCard.BottomActions>
        <Button variant="secondary">Install</Button>
        <Button variant="secondary">View on Github</Button>
      </DashboardCard.BottomActions>
    </DashboardCard>
  );
};
